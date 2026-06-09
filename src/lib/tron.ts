// TRON helpers — TronLink browser extension integration.
export const USDT_TRC20_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
export const USDT_TRC20_DECIMALS = 6;
export const TRX_USD_PRICE_FALLBACK = 0.13;

export interface TronLinkWindow {
  tronLink?: {
    request: (args: { method: string }) => Promise<{ code?: number; message?: string }>;
    ready?: boolean;
    tronWeb?: any;
  };
  tronWeb?: any;
}

export interface TronNetwork {
  slug: string;
  name: string;
  isTestnet: boolean;
  fullHost: string;
  explorer: string;
}

export const TRON_NETWORKS: TronNetwork[] = [
  { slug: "tron", name: "TRON Mainnet", isTestnet: false, fullHost: "https://api.trongrid.io", explorer: "https://tronscan.org/#" },
  { slug: "tron-shasta", name: "TRON Shasta", isTestnet: true, fullHost: "https://api.shasta.trongrid.io", explorer: "https://shasta.tronscan.org/#" },
  { slug: "tron-nile", name: "TRON Nile", isTestnet: true, fullHost: "https://nile.trongrid.io", explorer: "https://nile.tronscan.org/#" },
];

export const tronNetworkBySlug = (slug: string) => TRON_NETWORKS.find((n) => n.slug === slug);

export const getTron = (): TronLinkWindow["tronLink"] | undefined => {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as TronLinkWindow).tronLink;
};

export const getTronWeb = (): any | undefined => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as TronLinkWindow;
  return w.tronLink?.tronWeb || w.tronWeb;
};

/** Returns the slug of the TRON network the user's TronLink is currently connected to. */
export const getActiveTronSlug = (): string | null => {
  const tw = getTronWeb();
  if (!tw) return null;
  const host: string | undefined = tw.fullNode?.host || tw.solidityNode?.host;
  if (!host) return null;
  if (host.includes("shasta")) return "tron-shasta";
  if (host.includes("nile")) return "tron-nile";
  return "tron";
};
