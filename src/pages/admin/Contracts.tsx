import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Loader2, Shield, Plus, Code, Zap, FileCode, ExternalLink,
  Play, Send, Trash2, ChevronDown, RefreshCw, AlertCircle,
} from "lucide-react";
import { useWriteContract, useReadContract, useSendTransaction } from "wagmi";
import { type Abi, type AbiFunction, type Address } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import SectionHeader from "@/components/SectionHeader";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useWallet } from "@/providers/WalletProvider";
import { useMembership } from "@/hooks/useMembership";
import { supabase } from "@/integrations/supabase/client";
import { EVM_NETWORKS, networkBySlug, networkById } from "@/lib/wagmi";
import { TRON_NETWORKS, tronNetworkBySlug, getActiveTronSlug } from "@/lib/tron";
import {
  compileSolidity, parseAbi, listFunctions, isReadFunction, castInputs, stringifyResult,
  tronDeployContract, tronReadFunction, tronWriteFunction,
  buildEvmDeployData, isValidEvmAddress, isValidTronAddress,
  type CompileResult,
} from "@/lib/contracts";

interface Contract {
  id: string;
  label: string;
  description: string | null;
  network: string;
  chain_kind: "evm" | "tron";
  address: string;
  abi: any;
  bytecode: string | null;
  deployment_tx: string | null;
  deployed_by: string | null;
  verified: boolean;
  created_at: string;
}

interface CallRow {
  id: string;
  contract_id: string | null;
  function_name: string;
  arguments: any;
  kind: "read" | "write" | "deploy";
  status: "pending" | "success" | "failed";
  result: any;
  tx_hash: string | null;
  error: string | null;
  created_at: string;
}

const ALL_NETWORKS = [
  ...EVM_NETWORKS.map((n) => ({ slug: n.slug, name: n.name, kind: "evm" as const, isTestnet: n.isTestnet })),
  ...TRON_NETWORKS.map((n) => ({ slug: n.slug, name: n.name, kind: "tron" as const, isTestnet: n.isTestnet })),
];

const Contracts = () => {
  const { active } = useWallet();
  const { isAdmin, loading } = useMembership();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [calls, setCalls] = useState<CallRow[]>([]);
  const [tab, setTab] = useState("registry");
  const [openContract, setOpenContract] = useState<string | null>(null);

  const fetchAll = async () => {
    const [{ data: c }, { data: l }] = await Promise.all([
      supabase.from("smart_contracts").select("*").order("created_at", { ascending: false }),
      supabase.from("contract_calls").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    setContracts((c || []) as any);
    setCalls((l || []) as any);
  };

  useEffect(() => { if (isAdmin) fetchAll(); }, [isAdmin]);

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
  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <>
      <SEO title="Smart Contracts — Admin" description="Deploy and call smart contracts across EVM and TRON networks." />
      <section className="container-luxe py-24">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-12">
          <SectionHeader
            eyebrow="Admin · Contracts"
            title="Smart Contract Console"
            description="Compile and deploy Solidity, register existing contracts, call any read/write function across EVM (mainnet + testnet) and TRON (mainnet + Shasta + Nile)."
          />
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link to="/admin">← Admissions</Link>
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-onyx-700">
            <TabsTrigger value="registry">Registry ({contracts.length})</TabsTrigger>
            <TabsTrigger value="register">Register existing</TabsTrigger>
            <TabsTrigger value="deploy">Deploy new</TabsTrigger>
            <TabsTrigger value="history">History ({calls.length})</TabsTrigger>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={fetchAll}><RefreshCw size={14} /></Button>
          </TabsList>

          <TabsContent value="registry" className="mt-6 space-y-3">
            {contracts.length === 0 && (
              <div className="text-center py-16 text-muted-foreground text-sm">
                No contracts yet. Deploy or register one to begin.
              </div>
            )}
            {contracts.map((c) => (
              <ContractCard
                key={c.id}
                contract={c}
                isOpen={openContract === c.id}
                onToggle={() => setOpenContract(openContract === c.id ? null : c.id)}
                onChange={fetchAll}
              />
            ))}
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <RegisterForm onDone={() => { fetchAll(); setTab("registry"); }} />
          </TabsContent>

          <TabsContent value="deploy" className="mt-6">
            <DeployForm onDone={() => { fetchAll(); setTab("registry"); }} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <CallHistory calls={calls} contracts={contracts} />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

/* ============ Contract card with read/write playground ============ */

const ContractCard = ({ contract, isOpen, onToggle, onChange }: {
  contract: Contract; isOpen: boolean; onToggle: () => void; onChange: () => void;
}) => {
  const abi = contract.abi as Abi;
  const fns = useMemo(() => listFunctions(abi), [abi]);
  const reads = fns.filter(isReadFunction);
  const writes = fns.filter((f) => !isReadFunction(f));

  const explorer = useMemo(() => {
    const evm = networkBySlug(contract.network);
    if (evm) return `${evm.explorer}/address/${contract.address}`;
    const tron = tronNetworkBySlug(contract.network);
    if (tron) return `${tron.explorer}/address/${contract.address}`;
    return "#";
  }, [contract.network, contract.address]);

  const remove = async () => {
    if (!confirm(`Delete ${contract.label}? Call history is preserved.`)) return;
    const { error } = await supabase.from("smart_contracts").delete().eq("id", contract.id);
    if (error) return toast.error(error.message);
    toast.success("Contract removed");
    onChange();
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="glass-panel">
      <CollapsibleTrigger className="w-full p-5 flex items-start justify-between gap-4 hover:bg-onyx-700/30 transition-colors">
        <div className="text-left">
          <div className="flex items-center gap-3 flex-wrap">
            <FileCode size={16} className="text-primary" />
            <span className="font-display text-lg">{contract.label}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border border-border">
              {contract.chain_kind}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border border-border">
              {contract.network}
            </span>
            {contract.deployment_tx && (
              <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border border-primary text-primary">deployed</span>
            )}
          </div>
          <div className="font-mono text-xs text-muted-foreground mt-2 break-all">{contract.address}</div>
          {contract.description && <p className="text-xs text-muted-foreground mt-1">{contract.description}</p>}
        </div>
        <ChevronDown size={16} className={`mt-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>

      <CollapsibleContent className="px-5 pb-5 space-y-6 border-t border-border pt-5">
        <div className="flex gap-2 flex-wrap">
          <a href={explorer} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm"><ExternalLink size={12} /> Explorer</Button>
          </a>
          <Button variant="outline" size="sm" onClick={remove} className="text-destructive">
            <Trash2 size={12} /> Remove
          </Button>
        </div>

        {reads.length > 0 && (
          <FunctionGroup title="Read functions" icon={<Play size={14} />} fns={reads} contract={contract} mode="read" onAfter={onChange} />
        )}
        {writes.length > 0 && (
          <FunctionGroup title="Write functions" icon={<Send size={14} />} fns={writes} contract={contract} mode="write" onAfter={onChange} />
        )}
        {fns.length === 0 && <p className="text-sm text-muted-foreground">ABI exposes no callable functions.</p>}
      </CollapsibleContent>
    </Collapsible>
  );
};

const FunctionGroup = ({ title, icon, fns, contract, mode, onAfter }: {
  title: string; icon: React.ReactNode; fns: AbiFunction[]; contract: Contract; mode: "read" | "write"; onAfter: () => void;
}) => (
  <div className="space-y-3">
    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">{icon} {title}</div>
    {fns.map((fn, i) => (
      <FunctionRow key={`${fn.name}-${i}`} fn={fn} contract={contract} mode={mode} onAfter={onAfter} />
    ))}
  </div>
);

const FunctionRow = ({ fn, contract, mode, onAfter }: {
  fn: AbiFunction; contract: Contract; mode: "read" | "write"; onAfter: () => void;
}) => {
  const { active } = useWallet();
  const { writeContractAsync } = useWriteContract();
  const [args, setArgs] = useState<string[]>(fn.inputs.map(() => ""));
  const [value, setValue] = useState("0"); // ETH value for payable
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPayable = fn.stateMutability === "payable";

  const log = async (status: "success" | "failed", payload: { result?: string; tx_hash?: string; error?: string }) => {
    await supabase.from("contract_calls").insert({
      contract_id: contract.id,
      network: contract.network,
      chain_kind: contract.chain_kind,
      address: contract.address,
      function_name: fn.name,
      arguments: args,
      kind: mode,
      status,
      result: payload.result ? JSON.parse(payload.result) : null,
      tx_hash: payload.tx_hash ?? null,
      error: payload.error ?? null,
      caller_wallet: active?.address ?? null,
    } as any);
  };

  const run = async () => {
    setBusy(true); setError(null); setResult(null);
    try {
      const parsed = castInputs(fn.inputs, args);

      if (contract.chain_kind === "tron") {
        if (active?.chain !== "tron") throw new Error("Switch to TronLink to use a TRON contract");
        if (mode === "read") {
          const r = await tronReadFunction(contract.address, contract.abi as Abi, fn.name, parsed);
          const s = stringifyResult(r);
          setResult(s);
          await log("success", { result: s });
        } else {
          const callValue = isPayable ? Math.round(Number(value) * 1_000_000) : 0;
          const tx = await tronWriteFunction(contract.address, contract.abi as Abi, fn.name, parsed, callValue);
          setResult(tx);
          await log("success", { tx_hash: tx, result: JSON.stringify(tx) });
          toast.success(`Transaction broadcast: ${tx.slice(0, 10)}…`);
        }
      } else {
        const evm = networkBySlug(contract.network);
        if (!evm) throw new Error(`Unknown EVM network ${contract.network}`);
        if (active?.chain !== "evm") throw new Error("Switch to an EVM wallet");
        if (mode === "read") {
          // Use a public client via viem inside the wagmi config
          const { readContract } = await import("wagmi/actions");
          const { wagmiConfig } = await import("@/lib/wagmi");
          const r = await readContract(wagmiConfig, {
            abi: contract.abi as Abi,
            address: contract.address as Address,
            functionName: fn.name,
            args: parsed,
            chainId: evm.id as any,
          } as any);
          const s = stringifyResult(r);
          setResult(s);
          await log("success", { result: s });
        } else {
          const hash = await writeContractAsync({
            abi: contract.abi as Abi,
            address: contract.address as Address,
            functionName: fn.name,
            args: parsed,
            chainId: evm.id as any,
            ...(isPayable ? { value: BigInt(Math.round(Number(value) * 1e18)) } : {}),
          } as any);
          setResult(hash);
          await log("success", { tx_hash: hash, result: JSON.stringify(hash) });
          toast.success(`Tx sent: ${hash.slice(0, 10)}…`);
        }
      }
      onAfter();
    } catch (err: any) {
      const msg = err?.shortMessage || err?.message || "Call failed";
      setError(msg);
      await log("failed", { error: msg });
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`border p-4 space-y-3 ${mode === "write" ? "border-primary/30" : "border-border"}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <code className="text-sm font-mono text-primary">{fn.name}</code>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{fn.stateMutability}</span>
        {isPayable && <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border border-primary text-primary">payable</span>}
      </div>

      {fn.inputs.map((p, i) => (
        <div key={i} className="space-y-1">
          <Label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {p.name || `arg${i}`} <span className="text-muted-foreground/60">({p.type})</span>
          </Label>
          <Input
            value={args[i]}
            onChange={(e) => setArgs((a) => a.map((v, j) => (j === i ? e.target.value : v)))}
            placeholder={p.type}
            className="bg-onyx-700 border-border h-9 font-mono text-xs"
          />
        </div>
      ))}
      {isPayable && (
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            value ({contract.chain_kind === "tron" ? "TRX" : "ETH/native"})
          </Label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} className="bg-onyx-700 border-border h-9 font-mono text-xs" />
        </div>
      )}

      <Button size="sm" variant={mode === "write" ? "emerald" : "outline"} onClick={run} disabled={busy}>
        {busy ? <Loader2 size={12} className="animate-spin" /> : mode === "write" ? <Send size={12} /> : <Play size={12} />}
        {mode === "write" ? "Send transaction" : "Call"}
      </Button>

      {result && (
        <pre className="text-xs bg-onyx-900 p-3 border border-border overflow-x-auto whitespace-pre-wrap break-all max-h-48">
          {result}
        </pre>
      )}
      {error && <div className="text-xs text-destructive flex items-start gap-2"><AlertCircle size={12} className="mt-0.5" /> {error}</div>}
    </div>
  );
};

/* ============ Register form ============ */

const RegisterForm = ({ onDone }: { onDone: () => void }) => {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [network, setNetwork] = useState(ALL_NETWORKS[0].slug);
  const [address, setAddress] = useState("");
  const [abiText, setAbiText] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      const net = ALL_NETWORKS.find((n) => n.slug === network);
      if (!net) throw new Error("Pick a network");
      if (net.kind === "evm" && !isValidEvmAddress(address)) throw new Error("Invalid EVM address");
      if (net.kind === "tron" && !isValidTronAddress(address)) throw new Error("Invalid TRON address");
      const abi = parseAbi(abiText);
      const { error } = await supabase.from("smart_contracts").insert({
        label, description: description || null, network, chain_kind: net.kind,
        address, abi, verified: true,
      } as any);
      if (error) throw error;
      toast.success(`${label} registered`);
      onDone();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass-panel p-8 space-y-5 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Label"><Input value={label} onChange={(e) => setLabel(e.target.value)} className="bg-onyx-700 border-border" /></Field>
        <Field label="Network">
          <NetworkSelect value={network} onChange={setNetwork} />
        </Field>
      </div>
      <Field label="Contract address">
        <Input value={address} onChange={(e) => setAddress(e.target.value)} className="bg-onyx-700 border-border font-mono text-xs" />
      </Field>
      <Field label="Description (optional)">
        <Input value={description} onChange={(e) => setDescription(e.target.value)} className="bg-onyx-700 border-border" />
      </Field>
      <Field label="ABI (paste JSON)">
        <Textarea
          value={abiText} onChange={(e) => setAbiText(e.target.value)}
          rows={10} className="bg-onyx-700 border-border font-mono text-xs"
          placeholder='[{"inputs":[],"name":"name","outputs":[{"type":"string"}],"stateMutability":"view","type":"function"}]'
        />
      </Field>
      <Button variant="emerald" onClick={submit} disabled={busy || !label || !address || !abiText}>
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Register contract
      </Button>
    </div>
  );
};

/* ============ Deploy form (compile or paste bytecode) ============ */

const DeployForm = ({ onDone }: { onDone: () => void }) => {
  const { active } = useWallet();
  const { sendTransactionAsync } = useSendTransaction();
  const [mode, setMode] = useState<"solidity" | "bytecode">("solidity");
  const [label, setLabel] = useState("");
  const [network, setNetwork] = useState(ALL_NETWORKS[0].slug);
  const [source, setSource] = useState(DEFAULT_SOLIDITY);
  const [compiled, setCompiled] = useState<CompileResult[]>([]);
  const [picked, setPicked] = useState(0);
  const [abiText, setAbiText] = useState("");
  const [bytecode, setBytecode] = useState("");
  const [argsText, setArgsText] = useState("[]");
  const [compiling, setCompiling] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const compile = async () => {
    setCompiling(true);
    try {
      toast.info("Loading Solidity compiler (~3MB, first time only)…");
      const out = await compileSolidity(source);
      setCompiled(out);
      setPicked(0);
      toast.success(`Compiled: ${out.map((c) => c.contractName).join(", ")}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCompiling(false);
    }
  };

  const deploy = async () => {
    setDeploying(true);
    try {
      const net = ALL_NETWORKS.find((n) => n.slug === network);
      if (!net) throw new Error("Pick a network");

      let abi: Abi, byte: string;
      if (mode === "solidity") {
        if (!compiled.length) throw new Error("Compile the source first");
        abi = compiled[picked].abi;
        byte = compiled[picked].bytecode;
      } else {
        abi = parseAbi(abiText);
        byte = bytecode.startsWith("0x") ? bytecode : `0x${bytecode}`;
      }

      const ctorArgs: unknown[] = JSON.parse(argsText || "[]");

      let address: string, txHash: string;

      if (net.kind === "tron") {
        if (active?.chain !== "tron") throw new Error("Switch to TronLink");
        const tronSlug = getActiveTronSlug();
        if (tronSlug !== net.slug) throw new Error(`TronLink is on ${tronSlug || "unknown"} — switch to ${net.name}`);
        const r = await tronDeployContract({ abi, bytecode: byte, args: ctorArgs, name: label });
        address = r.address;
        txHash = r.txHash;
      } else {
        if (active?.chain !== "evm") throw new Error("Switch to an EVM wallet");
        const evm = networkBySlug(net.slug)!;
        const data = buildEvmDeployData(abi, byte as `0x${string}`, ctorArgs);
        txHash = await sendTransactionAsync({ data, chainId: evm.id as any });
        // Wait for receipt to capture the deployed address
        const { waitForTransactionReceipt } = await import("wagmi/actions");
        const { wagmiConfig } = await import("@/lib/wagmi");
        const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: txHash as `0x${string}`, chainId: evm.id as any });
        if (!receipt.contractAddress) throw new Error("No contract address in receipt");
        address = receipt.contractAddress;
      }

      const { error } = await supabase.from("smart_contracts").insert({
        label, network: net.slug, chain_kind: net.kind,
        address, abi, bytecode: byte, constructor_args: ctorArgs,
        deployment_tx: txHash, deployed_by: active?.address, verified: true,
      } as any);
      if (error) throw error;

      await supabase.from("contract_calls").insert({
        network: net.slug, chain_kind: net.kind, address,
        function_name: "constructor", arguments: ctorArgs, kind: "deploy",
        status: "success", tx_hash: txHash, caller_wallet: active?.address,
      } as any);

      toast.success(`Deployed at ${address.slice(0, 10)}…`);
      onDone();
    } catch (err: any) {
      toast.error(err?.shortMessage || err.message);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="glass-panel p-8 space-y-6 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Label"><Input value={label} onChange={(e) => setLabel(e.target.value)} className="bg-onyx-700 border-border" /></Field>
        <Field label="Network"><NetworkSelect value={network} onChange={setNetwork} /></Field>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
        <TabsList className="bg-onyx-700">
          <TabsTrigger value="solidity"><Code size={12} /> Solidity source</TabsTrigger>
          <TabsTrigger value="bytecode"><Zap size={12} /> ABI + bytecode</TabsTrigger>
        </TabsList>

        <TabsContent value="solidity" className="space-y-4 mt-4">
          <Field label="Solidity source (compiled with v0.8.26 + optimizer)">
            <Textarea value={source} onChange={(e) => setSource(e.target.value)} rows={14}
              className="bg-onyx-900 border-border font-mono text-xs" />
          </Field>
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" onClick={compile} disabled={compiling}>
              {compiling ? <Loader2 size={14} className="animate-spin" /> : <Code size={14} />} Compile
            </Button>
            {compiled.length > 0 && (
              <>
                <span className="text-xs text-muted-foreground">Picked:</span>
                <Select value={String(picked)} onValueChange={(v) => setPicked(Number(v))}>
                  <SelectTrigger className="h-9 w-48 bg-onyx-700"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {compiled.map((c, i) => <SelectItem key={i} value={String(i)}>{c.contractName}</SelectItem>)}
                  </SelectContent>
                </Select>
                <span className="text-xs text-primary">✓ {compiled.length} contract{compiled.length > 1 ? "s" : ""} ready</span>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bytecode" className="space-y-4 mt-4">
          <Field label="ABI (JSON)">
            <Textarea value={abiText} onChange={(e) => setAbiText(e.target.value)} rows={6}
              className="bg-onyx-700 border-border font-mono text-xs" />
          </Field>
          <Field label="Bytecode (hex, with or without 0x)">
            <Textarea value={bytecode} onChange={(e) => setBytecode(e.target.value)} rows={4}
              className="bg-onyx-700 border-border font-mono text-xs" />
          </Field>
        </TabsContent>
      </Tabs>

      <Field label="Constructor arguments (JSON array)">
        <Input value={argsText} onChange={(e) => setArgsText(e.target.value)}
          className="bg-onyx-700 border-border font-mono text-xs" placeholder='["My Token", "MTK", 18]' />
      </Field>

      <Button variant="emerald" size="lg" onClick={deploy}
        disabled={deploying || !label || (mode === "solidity" ? !compiled.length : (!abiText || !bytecode))}>
        {deploying ? <><Loader2 size={14} className="animate-spin" /> Deploying…</> : <><Send size={14} /> Deploy contract</>}
      </Button>
    </div>
  );
};

/* ============ Call history ============ */

const CallHistory = ({ calls, contracts }: { calls: CallRow[]; contracts: Contract[] }) => {
  const byId = useMemo(() => Object.fromEntries(contracts.map((c) => [c.id, c])), [contracts]);
  if (calls.length === 0) return <div className="text-center py-16 text-muted-foreground text-sm">No calls yet.</div>;

  return (
    <div className="space-y-2">
      {calls.map((call) => {
        const c = call as any;
        const contract = c.contract_id ? byId[c.contract_id] : null;
        const explorer = c.tx_hash ? buildTxUrl(c.network, c.tx_hash) : null;
        return (
          <div key={c.id} className="glass-panel p-4 text-xs space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-2 py-0.5 border text-[10px] uppercase tracking-[0.2em] ${
                c.status === "success" ? "border-primary text-primary" :
                c.status === "failed" ? "border-destructive text-destructive" :
                "border-border text-muted-foreground"}`}>
                {c.status}
              </span>
              <span className="px-2 py-0.5 border border-border text-[10px] uppercase tracking-[0.2em]">{c.kind}</span>
              <code className="font-mono text-primary">{c.function_name}</code>
              <span className="text-muted-foreground">on {contract?.label || (c.address as string).slice(0, 10) + "…"} · {c.network}</span>
              <span className="text-muted-foreground ml-auto">{new Date(c.created_at).toLocaleString()}</span>
            </div>
            {c.arguments && Array.isArray(c.arguments) && c.arguments.length > 0 && (
              <div className="text-muted-foreground font-mono break-all">args: {JSON.stringify(c.arguments)}</div>
            )}
            {explorer && (
              <a href={explorer} target="_blank" rel="noreferrer" className="text-primary inline-flex items-center gap-1 hover:underline">
                tx {c.tx_hash?.slice(0, 14)}… <ExternalLink size={10} />
              </a>
            )}
            {c.result != null && (
              <pre className="bg-onyx-900 border border-border p-2 overflow-x-auto whitespace-pre-wrap break-all max-h-32">
                {typeof c.result === "string" ? c.result : JSON.stringify(c.result, null, 2)}
              </pre>
            )}
            {c.error && <div className="text-destructive">{c.error}</div>}
          </div>
        );
      })}
    </div>
  );
};

/* ============ Bits ============ */

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</Label>
    {children}
  </div>
);

const NetworkSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="bg-onyx-700 border-border h-10"><SelectValue /></SelectTrigger>
    <SelectContent className="max-h-80">
      <div className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">EVM Mainnets</div>
      {ALL_NETWORKS.filter((n) => n.kind === "evm" && !n.isTestnet).map((n) => (
        <SelectItem key={n.slug} value={n.slug}>{n.name}</SelectItem>
      ))}
      <div className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">EVM Testnets</div>
      {ALL_NETWORKS.filter((n) => n.kind === "evm" && n.isTestnet).map((n) => (
        <SelectItem key={n.slug} value={n.slug}>{n.name}</SelectItem>
      ))}
      <div className="px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">TRON</div>
      {ALL_NETWORKS.filter((n) => n.kind === "tron").map((n) => (
        <SelectItem key={n.slug} value={n.slug}>{n.name}{n.isTestnet ? " (testnet)" : ""}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const buildTxUrl = (network: string, hash: string) => {
  const evm = networkBySlug(network);
  if (evm) return `${evm.explorer}/tx/${hash}`;
  const tron = tronNetworkBySlug(network);
  if (tron) return `${tron.explorer}/transaction/${hash}`;
  return "#";
};

const DEFAULT_SOLIDITY = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Counter {
    uint256 public count;
    address public owner;

    event Incremented(uint256 newValue, address by);

    constructor() {
        owner = msg.sender;
    }

    function increment() external {
        count += 1;
        emit Incremented(count, msg.sender);
    }

    function set(uint256 value) external {
        require(msg.sender == owner, "not owner");
        count = value;
    }
}
`;

export default Contracts;
