import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, base, polygon, arbitrum, optimism, bsc } from "wagmi/chains";

export const WALLETCONNECT_PROJECT_ID = "9db8a683b11dd6cc3f2650ca8c41dc96";

export const wagmiConfig = getDefaultConfig({
  appName: "Noir/Vault",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, base, polygon, arbitrum, optimism, bsc],
  ssr: false,
});

// USDC contract addresses per chain (6 decimals on all)
export const USDC_ADDRESSES: Record<number, `0x${string}`> = {
  [mainnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  [polygon.id]: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  [arbitrum.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  [optimism.id]: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  [bsc.id]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC on BSC (18 decimals!)
};

// USDC decimals — BSC uses 18, others use 6
export const USDC_DECIMALS: Record<number, number> = {
  [mainnet.id]: 6,
  [base.id]: 6,
  [polygon.id]: 6,
  [arbitrum.id]: 6,
  [optimism.id]: 6,
  [bsc.id]: 18,
};

// Approximate USD price of native token (for $100 conversion at submission time).
// In production, fetch from an oracle. For now, hardcoded sane defaults.
export const NATIVE_USD_PRICE_FALLBACK: Record<number, number> = {
  [mainnet.id]: 3500,
  [base.id]: 3500,
  [polygon.id]: 0.7,
  [arbitrum.id]: 3500,
  [optimism.id]: 3500,
  [bsc.id]: 600,
};
