import { useState } from "react";
import { Check, Lock, Send, Wallet, Zap, Loader2 } from "lucide-react";
import { useWriteContract, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import SectionHeader from "@/components/SectionHeader";
import SEO from "@/components/SEO";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useWallet } from "@/providers/WalletProvider";
import { supabase } from "@/integrations/supabase/client";
import { buildEvmPriorityTx, payPriorityFeeTron, PRIORITY_FEE_USD, type PaymentAsset, NATIVE_SYMBOLS, CHAIN_NAMES } from "@/lib/payments";

const Apply = () => {
  const { active } = useWallet();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [priority, setPriority] = useState(false);
  const [paymentAsset, setPaymentAsset] = useState<PaymentAsset>("stable");

  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();
  // Note: wait helpers used inline below

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) {
      toast.error("Connect a wallet to submit your application.");
      return;
    }

    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      wallet_address: active.address,
      full_name: String(fd.get("name") || ""),
      alias: String(fd.get("alias") || "") || null,
      email: String(fd.get("email") || ""),
      jurisdiction: String(fd.get("jurisdiction") || ""),
      tier_of_interest: (fd.get("tier") as string) || null,
      holdings: (fd.get("holdings") as string) || null,
      endorser: String(fd.get("endorser") || "") || null,
      note: String(fd.get("note") || "") || null,
      priority,
    };

    setSubmitting(true);
    try {
      // 1. Insert application
      const { data: app, error } = await supabase
        .from("applications")
        .insert(payload as any)
        .select()
        .single();
      if (error) throw error;

      // 2. If priority, send the on-chain payment
      if (priority && app) {
        toast.info("Confirm the priority fee transfer in your wallet…");
        let result;
        if (active.chain === "evm" && active.chainId) {
          const tx = buildEvmPriorityTx(active.chainId, paymentAsset);
          let hash: `0x${string}`;
          if (tx.kind === "erc20") {
            hash = await writeContractAsync({
              address: tx.address,
              abi: tx.abi,
              functionName: tx.functionName,
              args: tx.args as any,
              chainId: active.chainId as any,
            } as any);
          } else {
            hash = await sendTransactionAsync({
              to: tx.to,
              value: tx.value,
              chainId: active.chainId as any,
            });
          }
          result = {
            txHash: hash,
            asset: tx.assetSymbol,
            amountPaid: tx.humanAmount,
            chain: CHAIN_NAMES[active.chainId] || `chain-${active.chainId}`,
          };
        } else if (active.chain === "tron") {
          result = await payPriorityFeeTron(paymentAsset);
        } else {
          throw new Error("Unsupported chain");
        }

        const { error: payErr } = await supabase.from("priority_payments").insert({
          application_id: app.id,
          wallet_address: active.address,
          amount_usd: PRIORITY_FEE_USD,
          asset: result.asset,
          amount_paid: result.amountPaid,
          tx_hash: result.txHash,
          chain: result.chain,
        } as any);
        if (payErr) throw payErr;
      }

      setSubmitted(true);
      toast.success("Application received.");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.shortMessage || err?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <SEO title="Application Received" description="Your file is now with the Noir/Vault admissions chamber." />
        <section className="container-luxe py-32 min-h-[70vh] flex items-center">
          <div className="max-w-2xl mx-auto text-center animate-fade-up">
            <div className="w-16 h-16 mx-auto mb-8 border border-primary flex items-center justify-center text-primary">
              <Check size={24} />
            </div>
            <div className="eyebrow mb-5 justify-center flex">Application Received</div>
            <h1 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
              Your file is now with the admissions chamber.
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Submitted from <span className="font-mono text-primary text-sm">{active?.address}</span>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Once approved, this same wallet unlocks all member features. Reconnect any time to check status.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Apply for Whitelist"
        description="Connect your wallet and submit your file to the Noir/Vault admissions chamber."
      />
      <section className="container-luxe py-24 md:py-32">
        <SectionHeader
          eyebrow="Apply / Whitelist"
          title="Submit your file. Quietly."
          description="Membership is reviewed by hand. Your wallet becomes your access key — once approved, the same wallet unlocks every member feature."
        />
      </section>

      <section className="container-luxe pb-32">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-8 md:p-12">
              {/* Wallet block */}
              <div className="border border-border p-6 bg-onyx-700/30">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <Wallet size={18} className="text-primary mt-1" />
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Access Wallet</div>
                      {active ? (
                        <>
                          <div className="font-mono text-sm break-all">{active.address}</div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-primary mt-1">
                            {active.chain === "evm" ? `EVM · Chain ${active.chainId}` : "TRON"}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">Connect a wallet to begin.</div>
                      )}
                    </div>
                  </div>
                  <ConnectWalletButton compact />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Full name" id="name">
                  <Input id="name" name="name" required className="bg-onyx-700 border-border h-12" />
                </Field>
                <Field label="Preferred alias (optional)" id="alias">
                  <Input id="alias" name="alias" className="bg-onyx-700 border-border h-12" />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Private email" id="email">
                  <Input id="email" name="email" type="email" required className="bg-onyx-700 border-border h-12" />
                </Field>
                <Field label="Jurisdiction of residence" id="jurisdiction">
                  <Input id="jurisdiction" name="jurisdiction" required className="bg-onyx-700 border-border h-12" />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Tier of interest" id="tier">
                  <Select name="tier">
                    <SelectTrigger className="bg-onyx-700 border-border h-12">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initiate">Initiate</SelectItem>
                      <SelectItem value="sovereign">Sovereign</SelectItem>
                      <SelectItem value="noir">Noir (by invitation)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Estimated digital holdings" id="holdings">
                  <Select name="holdings">
                    <SelectTrigger className="bg-onyx-700 border-border h-12">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250k_1m">$250k – $1m</SelectItem>
                      <SelectItem value="1m_10m">$1m – $10m</SelectItem>
                      <SelectItem value="10m_100m">$10m – $100m</SelectItem>
                      <SelectItem value="100m_plus">$100m+</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field label="Endorsing member or family office (if any)" id="endorser">
                <Input id="endorser" name="endorser" className="bg-onyx-700 border-border h-12" />
              </Field>

              <Field label="A note to the admissions chamber" id="note">
                <Textarea id="note" name="note" rows={5} className="bg-onyx-700 border-border" placeholder="Tell us, briefly, why Noir/Vault." />
              </Field>

              {/* Priority */}
              <div className="border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Zap size={18} className="text-primary mt-1" />
                    <div>
                      <div className="font-display text-lg">Priority Consideration</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay <span className="text-primary font-semibold">${PRIORITY_FEE_USD}</span> to move your file to the front of the chamber.
                        <span className="block text-xs mt-1">Fully refunded on chain if your application is rejected.</span>
                      </p>
                    </div>
                  </div>
                  <Switch checked={priority} onCheckedChange={setPriority} />
                </div>

                {priority && active && (
                  <div className="pt-4 border-t border-border">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">Pay with</div>
                    <RadioGroup value={paymentAsset} onValueChange={(v) => setPaymentAsset(v as PaymentAsset)} className="grid grid-cols-2 gap-3">
                      <label className={`border p-4 cursor-pointer transition-colors ${paymentAsset === "stable" ? "border-primary bg-primary/5" : "border-border"}`}>
                        <RadioGroupItem value="stable" className="sr-only" />
                        <div className="text-sm font-medium">Stablecoin</div>
                        <div className="text-xs text-muted-foreground mt-1">{active.chain === "tron" ? "USDT-TRC20" : "USDC"} · exactly $100</div>
                      </label>
                      <label className={`border p-4 cursor-pointer transition-colors ${paymentAsset === "native" ? "border-primary bg-primary/5" : "border-border"}`}>
                        <RadioGroupItem value="native" className="sr-only" />
                        <div className="text-sm font-medium">Native</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {active.chain === "tron" ? "TRX" : (active.chainId ? NATIVE_SYMBOLS[active.chainId] : "ETH")} · ~$100 equivalent
                        </div>
                      </label>
                    </RadioGroup>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3 text-xs text-muted-foreground">
                <Lock size={14} className="text-primary mt-0.5 shrink-0" />
                <p>
                  Your wallet address links your application to your future membership. Reviewed by humans, never sold, never shared.
                </p>
              </div>

              <Button type="submit" variant="emerald" size="xl" className="w-full" disabled={!active || submitting}>
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> :
                 !active ? "Connect Wallet to Submit" :
                 priority ? <>Submit & Pay ${PRIORITY_FEE_USD} <Send size={16} /></> :
                 <>Submit Application <Send size={16} /></>}
              </Button>
            </form>
          </div>

          <aside className="space-y-8">
            <div className="glass-panel p-8">
              <div className="eyebrow mb-4">Discretion</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every member of our admissions chamber operates under a binding NDA. We do not advertise our membership.
              </p>
            </div>
            <div className="glass-panel p-8">
              <div className="eyebrow mb-4">The Passage</div>
              <ol className="space-y-4 text-sm">
                {["Connect", "Submission", "Verification", "Initiation"].map((s, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className="font-display text-2xl text-primary/70 w-8">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="glass-panel p-8">
              <div className="eyebrow mb-4">Acceptance</div>
              <div className="font-display text-5xl text-gradient-emerald mb-1">0.08%</div>
              <p className="text-xs text-muted-foreground">of applications received in the last cycle.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

const Field = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</Label>
    {children}
  </div>
);

export default Apply;
