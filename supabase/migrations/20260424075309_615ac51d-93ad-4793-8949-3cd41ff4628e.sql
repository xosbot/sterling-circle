-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.membership_tier AS ENUM ('initiate', 'sovereign', 'noir');
CREATE TYPE public.holdings_range AS ENUM ('250k_1m', '1m_10m', '10m_100m', '100m_plus');
CREATE TYPE public.otc_side AS ENUM ('buy', 'sell');
CREATE TYPE public.otc_status AS ENUM ('open', 'matched', 'closed', 'cancelled');
CREATE TYPE public.order_kind AS ENUM ('obsidian_card', 'hardware_wallet');
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.priority_payment_status AS ENUM ('paid', 'refunded', 'consumed');

-- =========================================
-- UTILITY FUNCTIONS
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_wallet_trigger()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.wallet_address = lower(NEW.wallet_address); RETURN NEW; END;
$$;

-- Helper to read wallet from request header
CREATE OR REPLACE FUNCTION public.current_wallet()
RETURNS TEXT LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT lower(coalesce(current_setting('request.headers', true)::json->>'x-wallet-address', ''));
$$;

-- =========================================
-- ADMIN WALLETS
-- =========================================
CREATE TABLE public.admin_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_normalize_admin_wallet
BEFORE INSERT OR UPDATE ON public.admin_wallets
FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_trigger();

ALTER TABLE public.admin_wallets ENABLE ROW LEVEL SECURITY;

-- =========================================
-- APPLICATIONS
-- =========================================
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  full_name TEXT NOT NULL,
  alias TEXT,
  email TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  tier_of_interest public.membership_tier,
  holdings public.holdings_range,
  endorser TEXT,
  note TEXT,
  priority BOOLEAN NOT NULL DEFAULT false,
  status public.application_status NOT NULL DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_applications_wallet ON public.applications(wallet_address);
CREATE INDEX idx_applications_status ON public.applications(status);

CREATE TRIGGER trg_normalize_application_wallet
BEFORE INSERT OR UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_trigger();

CREATE TRIGGER trg_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- =========================================
-- MEMBERS
-- =========================================
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  tier public.membership_tier NOT NULL DEFAULT 'initiate',
  display_name TEXT,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  approved_by TEXT,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_members_wallet ON public.members(wallet_address);

CREATE TRIGGER trg_normalize_member_wallet
BEFORE INSERT OR UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_trigger();

CREATE TRIGGER trg_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- =========================================
-- SECURITY DEFINER HELPERS (after tables exist)
-- =========================================
CREATE OR REPLACE FUNCTION public.is_admin_wallet(_wallet TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_wallets WHERE wallet_address = lower(_wallet));
$$;

CREATE OR REPLACE FUNCTION public.is_member_wallet(_wallet TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members
    WHERE wallet_address = lower(_wallet) AND active = true
  );
$$;

-- =========================================
-- POLICIES — admin_wallets
-- =========================================
CREATE POLICY "Admins can view admin_wallets"
  ON public.admin_wallets FOR SELECT
  USING (public.is_admin_wallet(public.current_wallet()));

CREATE POLICY "Admins can manage admin_wallets"
  ON public.admin_wallets FOR ALL
  USING (public.is_admin_wallet(public.current_wallet()))
  WITH CHECK (public.is_admin_wallet(public.current_wallet()));

-- =========================================
-- POLICIES — applications
-- =========================================
CREATE POLICY "Anyone can submit application"
  ON public.applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Applicant or admin can view application"
  ON public.applications FOR SELECT
  USING (
    wallet_address = public.current_wallet()
    OR public.is_admin_wallet(public.current_wallet())
  );

CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE
  USING (public.is_admin_wallet(public.current_wallet()))
  WITH CHECK (public.is_admin_wallet(public.current_wallet()));

CREATE POLICY "Admins can delete applications"
  ON public.applications FOR DELETE
  USING (public.is_admin_wallet(public.current_wallet()));

-- =========================================
-- POLICIES — members
-- =========================================
CREATE POLICY "Anyone can read members for gating"
  ON public.members FOR SELECT USING (true);

CREATE POLICY "Admins can manage members"
  ON public.members FOR ALL
  USING (public.is_admin_wallet(public.current_wallet()))
  WITH CHECK (public.is_admin_wallet(public.current_wallet()));

-- =========================================
-- OTC REQUESTS
-- =========================================
CREATE TABLE public.otc_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  side public.otc_side NOT NULL,
  asset TEXT NOT NULL,
  amount NUMERIC(38, 8) NOT NULL CHECK (amount > 0),
  quote_currency TEXT NOT NULL DEFAULT 'USD',
  price_per_unit NUMERIC(38, 8),
  notes TEXT,
  status public.otc_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_otc_status ON public.otc_requests(status);
CREATE INDEX idx_otc_wallet ON public.otc_requests(wallet_address);

CREATE TRIGGER trg_normalize_otc_wallet
BEFORE INSERT OR UPDATE ON public.otc_requests
FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_trigger();

CREATE TRIGGER trg_otc_updated_at
BEFORE UPDATE ON public.otc_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.otc_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view OTC board"
  ON public.otc_requests FOR SELECT
  USING (
    public.is_member_wallet(public.current_wallet())
    OR public.is_admin_wallet(public.current_wallet())
  );

CREATE POLICY "Members can post OTC"
  ON public.otc_requests FOR INSERT
  WITH CHECK (
    public.is_member_wallet(public.current_wallet())
    AND wallet_address = public.current_wallet()
  );

CREATE POLICY "Members can update own OTC"
  ON public.otc_requests FOR UPDATE
  USING (
    wallet_address = public.current_wallet()
    OR public.is_admin_wallet(public.current_wallet())
  )
  WITH CHECK (
    wallet_address = public.current_wallet()
    OR public.is_admin_wallet(public.current_wallet())
  );

CREATE POLICY "Members can delete own OTC"
  ON public.otc_requests FOR DELETE
  USING (
    wallet_address = public.current_wallet()
    OR public.is_admin_wallet(public.current_wallet())
  );

-- =========================================
-- ORDERS
-- =========================================
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  kind public.order_kind NOT NULL,
  shipping_name TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_country TEXT NOT NULL,
  shipping_postal_code TEXT,
  contact_email TEXT NOT NULL,
  notes TEXT,
  status public.order_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_wallet ON public.orders(wallet_address);
CREATE INDEX idx_orders_status ON public.orders(status);

CREATE TRIGGER trg_normalize_order_wallet
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_trigger();

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own orders"
  ON public.orders FOR SELECT
  USING (
    wallet_address = public.current_wallet()
    OR public.is_admin_wallet(public.current_wallet())
  );

CREATE POLICY "Members can place orders"
  ON public.orders FOR INSERT
  WITH CHECK (
    public.is_member_wallet(public.current_wallet())
    AND wallet_address = public.current_wallet()
  );

CREATE POLICY "Members or admins can update orders"
  ON public.orders FOR UPDATE
  USING (
    (wallet_address = public.current_wallet() AND status = 'pending')
    OR public.is_admin_wallet(public.current_wallet())
  );

-- =========================================
-- PRIORITY PAYMENTS
-- =========================================
CREATE TABLE public.priority_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  amount_usd NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
  asset TEXT NOT NULL,
  amount_paid NUMERIC(38, 8) NOT NULL,
  tx_hash TEXT NOT NULL UNIQUE,
  chain TEXT NOT NULL DEFAULT 'ethereum',
  status public.priority_payment_status NOT NULL DEFAULT 'paid',
  refund_tx_hash TEXT,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_priority_app ON public.priority_payments(application_id);
CREATE INDEX idx_priority_wallet ON public.priority_payments(wallet_address);

CREATE TRIGGER trg_normalize_priority_wallet
BEFORE INSERT OR UPDATE ON public.priority_payments
FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_trigger();

CREATE TRIGGER trg_priority_updated_at
BEFORE UPDATE ON public.priority_payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.priority_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record priority payment"
  ON public.priority_payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Applicant or admin can view priority payment"
  ON public.priority_payments FOR SELECT
  USING (
    wallet_address = public.current_wallet()
    OR public.is_admin_wallet(public.current_wallet())
  );

CREATE POLICY "Admins can update priority payments"
  ON public.priority_payments FOR UPDATE
  USING (public.is_admin_wallet(public.current_wallet()))
  WITH CHECK (public.is_admin_wallet(public.current_wallet()));

-- =========================================
-- BOOTSTRAP placeholder admin wallet
-- =========================================
INSERT INTO public.admin_wallets (wallet_address, label)
VALUES ('0x0000000000000000000000000000000000000000', 'Replace with real admin wallet');
