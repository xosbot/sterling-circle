import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { WagmiProvider, useAccount, useDisconnect } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "@/lib/wagmi";
import { getTron, getTronWeb } from "@/lib/tron";
import { setActiveWallet } from "@/integrations/supabase/client";

export type ChainKind = "evm" | "tron";

interface ActiveWallet {
  address: string;
  chain: ChainKind;
  chainId?: number; // EVM only
}

interface WalletCtx {
  active: ActiveWallet | null;
  tronAddress: string | null;
  connectTron: () => Promise<void>;
  disconnectTron: () => void;
  disconnectAll: () => void;
}

const Ctx = createContext<WalletCtx>({
  active: null,
  tronAddress: null,
  connectTron: async () => {},
  disconnectTron: () => {},
  disconnectAll: () => {},
});

const queryClient = new QueryClient();

const InnerWalletState = ({ children }: { children: ReactNode }) => {
  const { address: evmAddress, chainId, isConnected: evmConnected } = useAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const [tronAddress, setTronAddress] = useState<string | null>(null);

  // Detect TronLink on mount + listen for account changes
  useEffect(() => {
    const tw = getTronWeb();
    if (tw?.defaultAddress?.base58) {
      setTronAddress(tw.defaultAddress.base58);
    }
    const handler = (e: MessageEvent) => {
      if (e.data?.message?.action === "setAccount" || e.data?.message?.action === "accountsChanged") {
        const next = getTronWeb()?.defaultAddress?.base58;
        setTronAddress(next || null);
      }
      if (e.data?.message?.action === "disconnect") setTronAddress(null);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // EVM takes priority if both connected (user can disconnect to switch)
  const active: ActiveWallet | null = evmConnected && evmAddress
    ? { address: evmAddress, chain: "evm", chainId }
    : tronAddress
    ? { address: tronAddress, chain: "tron" }
    : null;

  // Push the active wallet into the supabase client so RLS sees it
  useEffect(() => {
    setActiveWallet(active?.address ?? null);
  }, [active?.address]);

  const connectTron = useCallback(async () => {
    const tronLink = getTron();
    if (!tronLink) {
      window.open("https://www.tronlink.org/", "_blank");
      throw new Error("TronLink not detected. Please install TronLink.");
    }
    const res = await tronLink.request({ method: "tron_requestAccounts" });
    if (res?.code && res.code !== 200) {
      throw new Error(res.message || "TronLink connection rejected");
    }
    const addr = getTronWeb()?.defaultAddress?.base58;
    if (addr) setTronAddress(addr);
  }, []);

  const disconnectTron = useCallback(() => setTronAddress(null), []);

  const disconnectAll = useCallback(() => {
    if (evmConnected) disconnectEvm();
    setTronAddress(null);
  }, [evmConnected, disconnectEvm]);

  return (
    <Ctx.Provider value={{ active, tronAddress, connectTron, disconnectTron, disconnectAll }}>
      {children}
    </Ctx.Provider>
  );
};

export const WalletProvider = ({ children }: { children: ReactNode }) => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "hsl(155 70% 42%)",
          accentColorForeground: "hsl(0 0% 4%)",
          borderRadius: "small",
          fontStack: "system",
          overlayBlur: "small",
        })}
        modalSize="compact"
      >
        <InnerWalletState>{children}</InnerWalletState>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export const useWallet = () => useContext(Ctx);
