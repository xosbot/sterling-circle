import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWallet } from "@/providers/WalletProvider";

interface MembershipState {
  loading: boolean;
  isMember: boolean;
  isAdmin: boolean;
  tier: "initiate" | "sovereign" | "noir" | null;
}

export const useMembership = (): MembershipState => {
  const { active } = useWallet();
  const [state, setState] = useState<MembershipState>({
    loading: false,
    isMember: false,
    isAdmin: false,
    tier: null,
  });

  useEffect(() => {
    if (!active?.address) {
      setState({ loading: false, isMember: false, isAdmin: false, tier: null });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));

    const wallet = active.chain === "evm" ? active.address.toLowerCase() : active.address;

    Promise.all([
      supabase.from("members").select("tier, active").eq("wallet_address", wallet).maybeSingle(),
      supabase.from("admin_wallets").select("wallet_address").eq("wallet_address", wallet).maybeSingle(),
    ]).then(([m, a]) => {
      if (cancelled) return;
      setState({
        loading: false,
        isMember: !!(m.data && m.data.active),
        isAdmin: !!a.data,
        tier: (m.data?.tier as MembershipState["tier"]) ?? null,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [active?.address, active?.chain]);

  return state;
};
