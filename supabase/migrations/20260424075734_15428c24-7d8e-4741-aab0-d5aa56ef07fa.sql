-- Replace normalize trigger to be EVM-only
CREATE OR REPLACE FUNCTION public.normalize_wallet_trigger()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.wallet_address LIKE '0x%' THEN
    NEW.wallet_address = lower(NEW.wallet_address);
  END IF;
  RETURN NEW;
END;
$$;

-- Replace current_wallet to mirror that logic (lowercase only EVM)
CREATE OR REPLACE FUNCTION public.current_wallet()
RETURNS TEXT LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT CASE
    WHEN coalesce(current_setting('request.headers', true)::json->>'x-wallet-address', '') LIKE '0x%'
      THEN lower(current_setting('request.headers', true)::json->>'x-wallet-address')
    ELSE coalesce(current_setting('request.headers', true)::json->>'x-wallet-address', '')
  END;
$$;

-- Replace is_admin_wallet & is_member_wallet to mirror (lowercase only EVM)
CREATE OR REPLACE FUNCTION public.is_admin_wallet(_wallet TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_wallets
    WHERE wallet_address = CASE WHEN _wallet LIKE '0x%' THEN lower(_wallet) ELSE _wallet END
  );
$$;

CREATE OR REPLACE FUNCTION public.is_member_wallet(_wallet TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members
    WHERE wallet_address = CASE WHEN _wallet LIKE '0x%' THEN lower(_wallet) ELSE _wallet END
      AND active = true
  );
$$;
