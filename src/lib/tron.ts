// TRON helpers — TronLink browser extension integration.
// USDT-TRC20 contract on TRON mainnet
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

export const getTron = (): TronLinkWindow["tronLink"] | undefined => {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as TronLinkWindow).tronLink;
};

export const getTronWeb = (): any | undefined => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as TronLinkWindow;
  return w.tronLink?.tronWeb || w.tronWeb;
};
