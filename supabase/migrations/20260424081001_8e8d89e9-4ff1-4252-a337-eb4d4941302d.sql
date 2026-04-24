-- Smart contracts registry + call history for the admin dashboard

CREATE TYPE public.chain_kind AS ENUM ('evm', 'tron');
CREATE TYPE public.contract_call_kind AS ENUM ('read', 'write', 'deploy');
CREATE TYPE public.contract_call_status AS ENUM ('pending', 'success', 'failed');

CREATE TABLE public.smart_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  description text,
  network text NOT NULL,
  chain_kind public.chain_kind NOT NULL,
  address text NOT NULL,
  abi jsonb NOT NULL,
  bytecode text,
  constructor_args jsonb,
  deployment_tx text,
  deployed_by text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (network, address)
);

CREATE INDEX idx_smart_contracts_network ON public.smart_contracts(network);
CREATE INDEX idx_smart_contracts_chain_kind ON public.smart_contracts(chain_kind);

CREATE TABLE public.contract_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES public.smart_contracts(id) ON DELETE CASCADE,
  network text NOT NULL,
  chain_kind public.chain_kind NOT NULL,
  address text NOT NULL,
  function_name text NOT NULL,
  arguments jsonb,
  kind public.contract_call_kind NOT NULL,
  status public.contract_call_status NOT NULL DEFAULT 'pending',
  result jsonb,
  tx_hash text,
  error text,
  caller_wallet text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contract_calls_contract ON public.contract_calls(contract_id);
CREATE INDEX idx_contract_calls_created ON public.contract_calls(created_at DESC);

ALTER TABLE public.smart_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage smart_contracts"
  ON public.smart_contracts FOR ALL
  USING (public.is_admin_wallet(public.current_wallet()))
  WITH CHECK (public.is_admin_wallet(public.current_wallet()));

CREATE POLICY "Admins manage contract_calls"
  ON public.contract_calls FOR ALL
  USING (public.is_admin_wallet(public.current_wallet()))
  WITH CHECK (public.is_admin_wallet(public.current_wallet()));

CREATE TRIGGER trg_smart_contracts_updated
  BEFORE UPDATE ON public.smart_contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_smart_contracts_normalize
  BEFORE INSERT OR UPDATE ON public.smart_contracts
  FOR EACH ROW EXECUTE FUNCTION public.normalize_wallet_trigger();