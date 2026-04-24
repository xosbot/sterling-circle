import { useEffect, useState } from "react";
import { Loader2, Check, X, Shield, RefreshCw, ExternalLink } from "lucide-react";
import { useWriteContract, useSendTransaction } from "wagmi";
import { parseUnits, erc20Abi, type Address } from "viem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import SEO from "@/components/SEO";
import SectionHeader from "@/components/SectionHeader";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useWallet } from "@/providers/WalletProvider";
import { useMembership } from "@/hooks/useMembership";
import { supabase } from "@/integrations/supabase/client";
import { USDC_ADDRESSES, USDC_DECIMALS } from "@/lib/wagmi";
import { getTronWeb, USDT_TRC20_ADDRESS, USDT_TRC20_DECIMALS } from "@/lib/tron";

interface AppRow {
  id: string;
  wallet_address: string;
  full_name: string;
  alias: string | null;
  email: string;
  jurisdiction: string;
  tier_of_interest: "initiate" | "sovereign" | "noir" | null;
  holdings: string | null;
  endorser: string | null;
  note: string | null;
  priority: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface PayRow {
  id: string;
  application_id: string;
  wallet_address: string;
  asset: string;
  amount_paid: string;
  tx_hash: string;
  chain: string;
  status: "paid" | "refunded" | "consumed";
  refund_tx_hash: string | null;
}

const Admin = () => {
  const { active } = useWallet();
  const { isAdmin, loading } = useMembership();
  const [apps, setApps] = useState<AppRow[]>([]);
  const [pays, setPays] = useState<Record<string, PayRow>>({});
  const [tab, setTab] = useState("pending");
  const [tierChoice, setTierChoice] = useState<Record<string, "initiate" | "sovereign" | "noir">>({});
  const [busy, setBusy] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setApps((data || []) as any);

    const { data: payData } = await supabase.from("priority_payments").select("*");
    const map: Record<string, PayRow> = {};
    (payData || []).forEach((p: any) => { map[p.application_id] = p; });
    setPays(map);
  };

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  if (!loading && active && !isAdmin) return <Navigate to="/" replace />;

  if (!active) {
    return (
      <section className="container-luxe py-32 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md text-center space-y-6">
          <Shield size={32} className="mx-auto text-primary" />
          <h1 className="font-display text-3xl">Admin access</h1>
          <p className="text-sm text-muted-foreground">Connect an admin wallet to continue.</p>
          <ConnectWalletButton />
        </div>
      </section>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary" /></div>;
  }

  const filtered = apps.filter((a) => a.status === tab);

  const approve = async (a: AppRow) => {
    const tier = tierChoice[a.id] || a.tier_of_interest || "initiate";
    setBusy(a.id);
    try {
      const { error: e1 } = await supabase
        .from("applications")
        .update({ status: "approved", reviewed_by: active.address, reviewed_at: new Date().toISOString() } as any)
        .eq("id", a.id);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("members").insert({
        wallet_address: a.wallet_address,
        tier,
        application_id: a.id,
        approved_by: active.address,
      } as any);
      if (e2 && !e2.message.includes("duplicate")) throw e2;
      // Mark priority payment as consumed
      if (pays[a.id]) {
        await supabase.from("priority_payments").update({ status: "consumed" } as any).eq("id", pays[a.id].id);
      }
      toast.success(`${a.full_name} approved as ${tier}`);
      fetchAll();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  };

  const reject = async (a: AppRow) => {
    setBusy(a.id);
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: "rejected", reviewed_by: active.address, reviewed_at: new Date().toISOString() } as any)
        .eq("id", a.id);
      if (error) throw error;
      toast.success("Application rejected");
      fetchAll();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  };

  const refund = async (a: AppRow) => {
    const pay = pays[a.id];
    if (!pay) return;
    setBusy(a.id);
    try {
      let refundTx: string;

      if (pay.chain === "tron") {
        if (active.chain !== "tron") {
          toast.error("Switch to TronLink to refund a TRON payment");
          setBusy(null); return;
        }
        const tronWeb = getTronWeb();
        if (pay.asset === "USDT") {
          const c = await tronWeb.contract().at(USDT_TRC20_ADDRESS);
          const amt = Math.round(Number(pay.amount_paid) * 10 ** USDT_TRC20_DECIMALS);
          refundTx = await c.transfer(a.wallet_address, amt).send();
        } else {
          const sun = Math.round(Number(pay.amount_paid) * 1_000_000);
          const tx = await tronWeb.trx.sendTransaction(a.wallet_address, sun);
          refundTx = tx.txid || tx.transaction?.txID;
        }
      } else {
        if (active.chain !== "evm") {
          toast.error("Switch to an EVM wallet to refund an EVM payment");
          setBusy(null); return;
        }
        const chainIdMap: Record<string, number> = { ethereum: 1, base: 8453, polygon: 137, arbitrum: 42161, optimism: 10, bsc: 56 };
        const cid = chainIdMap[pay.chain];
        if (!cid) throw new Error(`Unknown chain ${pay.chain}`);

        if (pay.asset === "USDC") {
          const decimals = USDC_DECIMALS[cid];
          refundTx = await writeContractAsync({
            address: USDC_ADDRESSES[cid],
            abi: erc20Abi,
            functionName: "transfer",
            args: [a.wallet_address as Address, parseUnits(pay.amount_paid, decimals)],
            chainId: cid as any,
          } as any);
        } else {
          refundTx = await sendTransactionAsync({
            to: a.wallet_address as Address,
            value: parseUnits(pay.amount_paid, 18),
            chainId: cid as any,
          });
        }
      }

      await supabase.from("priority_payments").update({
        status: "refunded",
        refund_tx_hash: refundTx,
        refunded_at: new Date().toISOString(),
      } as any).eq("id", pay.id);
      toast.success("Refund sent");
      fetchAll();
    } catch (err: any) {
      toast.error(err?.shortMessage || err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <SEO title="Admin — Admissions Chamber" description="Internal tools for reviewing whitelist applications." />
      <section className="container-luxe py-24">
        <SectionHeader eyebrow="Admin" title="Admissions Chamber" description="Review wallet-bound applications, approve members, refund declined priority fees." />

        <Tabs value={tab} onValueChange={setTab} className="mt-12">
          <TabsList className="bg-onyx-700">
            <TabsTrigger value="pending">Pending ({apps.filter(a => a.status === "pending").length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({apps.filter(a => a.status === "approved").length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({apps.filter(a => a.status === "rejected").length})</TabsTrigger>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={fetchAll}><RefreshCw size={14} /></Button>
          </TabsList>

          <TabsContent value={tab} className="mt-6 space-y-4">
            {filtered.length === 0 && <div className="text-center py-16 text-muted-foreground text-sm">No {tab} applications.</div>}
            {filtered.map((a) => {
              const pay = pays[a.id];
              return (
                <div key={a.id} className="glass-panel p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-display text-xl">{a.full_name}</span>
                        {a.alias && <span className="text-xs text-muted-foreground">aka {a.alias}</span>}
                        {a.priority && <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 border border-primary text-primary">Priority</span>}
                        <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 border border-border">{a.tier_of_interest || "—"}</span>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground mt-1 break-all">{a.wallet_address}</div>
                      <div className="text-xs text-muted-foreground mt-2">{a.email} · {a.jurisdiction} · {a.holdings || "—"}</div>
                      {a.endorser && <div className="text-xs mt-1">Endorser: {a.endorser}</div>}
                      {a.note && <p className="text-sm mt-3 max-w-2xl text-muted-foreground italic">"{a.note}"</p>}
                      {pay && (
                        <div className="text-xs mt-3 flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-1 border ${pay.status === "refunded" ? "border-muted text-muted-foreground" : "border-primary text-primary"}`}>
                            {pay.amount_paid} {pay.asset} on {pay.chain} · {pay.status}
                          </span>
                          <a href={txUrl(pay.chain, pay.tx_hash)} target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1 hover:underline">
                            tx <ExternalLink size={10} />
                          </a>
                        </div>
                      )}
                    </div>

                    {a.status === "pending" && (
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <Select value={tierChoice[a.id] || a.tier_of_interest || "initiate"} onValueChange={(v) => setTierChoice((s) => ({ ...s, [a.id]: v as any }))}>
                          <SelectTrigger className="h-9 bg-onyx-700"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="initiate">Initiate</SelectItem>
                            <SelectItem value="sovereign">Sovereign</SelectItem>
                            <SelectItem value="noir">Noir</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button size="sm" variant="emerald" onClick={() => approve(a)} disabled={busy === a.id} className="flex-1">
                            {busy === a.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => reject(a)} disabled={busy === a.id} className="flex-1">
                            <X size={14} /> Reject
                          </Button>
                        </div>
                      </div>
                    )}

                    {a.status === "rejected" && pay && pay.status === "paid" && (
                      <Button size="sm" variant="emerald" onClick={() => refund(a)} disabled={busy === a.id}>
                        {busy === a.id ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Refund {pay.amount_paid} {pay.asset}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

const txUrl = (chain: string, hash: string) => {
  const map: Record<string, string> = {
    ethereum: `https://etherscan.io/tx/${hash}`,
    base: `https://basescan.org/tx/${hash}`,
    polygon: `https://polygonscan.com/tx/${hash}`,
    arbitrum: `https://arbiscan.io/tx/${hash}`,
    optimism: `https://optimistic.etherscan.io/tx/${hash}`,
    bsc: `https://bscscan.com/tx/${hash}`,
    tron: `https://tronscan.org/#/transaction/${hash}`,
  };
  return map[chain] || "#";
};

export default Admin;
