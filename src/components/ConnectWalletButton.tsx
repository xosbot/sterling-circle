import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, ChevronDown, LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useWallet } from "@/providers/WalletProvider";
import { useMembership } from "@/hooks/useMembership";
import { toast } from "sonner";

const truncate = (a: string) => a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;

export const ConnectWalletButton = ({ compact = false }: { compact?: boolean }) => {
  const { active, connectTron, disconnectAll } = useWallet();
  const { isMember, isAdmin, tier } = useMembership();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!active) return;
    await navigator.clipboard.writeText(active.address);
    setCopied(true);
    toast.success("Address copied");
    setTimeout(() => setCopied(false), 1500);
  };

  if (active) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={compact ? "sm" : "default"} className="gap-2 border-primary/40">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs">{truncate(active.address)}</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground hidden sm:inline">
              {active.chain === "evm" ? "EVM" : "TRON"}
            </span>
            <ChevronDown size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 bg-onyx-900 border-border">
          <DropdownMenuLabel className="font-mono text-xs break-all">{active.address}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-2 flex flex-wrap gap-2">
            <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 border border-border">{active.chain.toUpperCase()}</span>
            {isAdmin && <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 border border-primary text-primary">Admin</span>}
            {isMember && <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 border border-primary text-primary">{tier ?? "Member"}</span>}
            {!isMember && !isAdmin && <span className="text-[9px] uppercase tracking-[0.2em] px-2 py-1 border border-border text-muted-foreground">Guest</span>}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopy} className="gap-2 cursor-pointer">
            {copied ? <Check size={14} /> : <Copy size={14} />} Copy address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnectAll} className="gap-2 cursor-pointer text-destructive">
            <LogOut size={14} /> Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="emerald" size={compact ? "sm" : "default"} className="gap-2">
          <Wallet size={14} /> Connect Wallet <ChevronDown size={12} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-onyx-900 border-border">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Choose Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <DropdownMenuItem onClick={openConnectModal} className="cursor-pointer">
              <div className="flex flex-col">
                <span className="text-sm">EVM (MetaMask, WalletConnect)</span>
                <span className="text-[10px] text-muted-foreground">Ethereum · Base · Polygon · Arbitrum · Optimism · BNB</span>
              </div>
            </DropdownMenuItem>
          )}
        </ConnectButton.Custom>
        <DropdownMenuItem
          onClick={() => connectTron().catch((e) => toast.error(e.message))}
          className="cursor-pointer"
        >
          <div className="flex flex-col">
            <span className="text-sm">TRON (TronLink)</span>
            <span className="text-[10px] text-muted-foreground">USDT-TRC20 · TRX</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
