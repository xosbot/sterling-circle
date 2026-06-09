import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet, base, polygon, arbitrum, optimism, bsc,
  sepolia, baseSepolia, polygonAmoy, arbitrumSepolia, optimismSepolia, bscTestnet,
} from "wagmi/chains";

export const WALLETCONNECT_PROJECT_ID = "9db8a683b11dd6cc3f2650ca8c41dc96";

export const wagmiConfig = getDefaultConfig({
  appName: "Noir/Vault",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [
    mainnet, base, polygon, arbitrum, optimism, bsc,
    sepolia, baseSepolia, polygonAmoy, arbitrumSepolia, optimismSepolia, bscTestnet,
  ],
  ssr: false,
});

// USDC contract addresses per chain (mainnets only — testnets use faucet tokens)
export const USDC_ADDRESSES: Record<number, `0x${string}`> = {
  [mainnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  [polygon.id]: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  [arbitrum.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  [optimism.id]: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  [bsc.id]: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
};

export const USDC_DECIMALS: Record<number, number> = {
  [mainnet.id]: 6, [base.id]: 6, [polygon.id]: 6,
  [arbitrum.id]: 6, [optimism.id]: 6, [bsc.id]: 18,
};

export const NATIVE_USD_PRICE_FALLBACK: Record<number, number> = {
  [mainnet.id]: 3500, [base.id]: 3500, [polygon.id]: 0.7,
  [arbitrum.id]: 3500, [optimism.id]: 3500, [bsc.id]: 600,
  // Testnets — value is symbolic, prevents division by zero
  [sepolia.id]: 3500, [baseSepolia.id]: 3500, [polygonAmoy.id]: 0.7,
  [arbitrumSepolia.id]: 3500, [optimismSepolia.id]: 3500, [bscTestnet.id]: 600,
};

// Display name + testnet flag for UI dropdowns
export interface NetworkInfo {
  id: number;
  name: string;
  slug: string;
  isTestnet: boolean;
  explorer: string;
}

export const EVM_NETWORKS: NetworkInfo[] = [
  { id: mainnet.id, name: "Ethereum", slug: "ethereum", isTestnet: false, explorer: "https://etherscan.io" },
  { id: base.id, name: "Base", slug: "base", isTestnet: false, explorer: "https://basescan.org" },
  { id: polygon.id, name: "Polygon", slug: "polygon", isTestnet: false, explorer: "https://polygonscan.com" },
  { id: arbitrum.id, name: "Arbitrum", slug: "arbitrum", isTestnet: false, explorer: "https://arbiscan.io" },
  { id: optimism.id, name: "Optimism", slug: "optimism", isTestnet: false, explorer: "https://optimistic.etherscan.io" },
  { id: bsc.id, name: "BNB Chain", slug: "bsc", isTestnet: false, explorer: "https://bscscan.com" },
  { id: sepolia.id, name: "Sepolia", slug: "sepolia", isTestnet: true, explorer: "https://sepolia.etherscan.io" },
  { id: baseSepolia.id, name: "Base Sepolia", slug: "base-sepolia", isTestnet: true, explorer: "https://sepolia.basescan.org" },
  { id: polygonAmoy.id, name: "Polygon Amoy", slug: "polygon-amoy", isTestnet: true, explorer: "https://amoy.polygonscan.com" },
  { id: arbitrumSepolia.id, name: "Arbitrum Sepolia", slug: "arbitrum-sepolia", isTestnet: true, explorer: "https://sepolia.arbiscan.io" },
  { id: optimismSepolia.id, name: "Optimism Sepolia", slug: "optimism-sepolia", isTestnet: true, explorer: "https://sepolia-optimism.etherscan.io" },
  { id: bscTestnet.id, name: "BNB Testnet", slug: "bsc-testnet", isTestnet: true, explorer: "https://testnet.bscscan.com" },
];

export const networkBySlug = (slug: string) => EVM_NETWORKS.find((n) => n.slug === slug);
export const networkById = (id: number) => EVM_NETWORKS.find((n) => n.id === id);
