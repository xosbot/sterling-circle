import { parseUnits, erc20Abi, type Address } from "viem";
import { getTronWeb, USDT_TRC20_ADDRESS, USDT_TRC20_DECIMALS, TRX_USD_PRICE_FALLBACK } from "@/lib/tron";
import { USDC_ADDRESSES, USDC_DECIMALS, NATIVE_USD_PRICE_FALLBACK } from "@/lib/wagmi";

export const PRIORITY_FEE_USD = 100;
export type PaymentAsset = "native" | "stable";

export const EVM_ADMIN_ADDRESS: Address = "0x51aB18d837b2898DC53B95A58F78Cf730E4e2C16";
export const TRON_ADMIN_ADDRESS = "TKbEYJHsibLa55dvKreFFyWVkBPNfTqf54";

export interface PaymentResult {
  txHash: string;
  asset: string;
  amountPaid: string;
  chain: string;
}

export const CHAIN_NAMES: Record<number, string> = {
  1: "ethereum", 8453: "base", 137: "polygon",
  42161: "arbitrum", 10: "optimism", 56: "bsc",
};

export const NATIVE_SYMBOLS: Record<number, string> = {
  1: "ETH", 8453: "ETH", 137: "MATIC", 42161: "ETH", 10: "ETH", 56: "BNB",
};

export const NATIVE_DECIMALS = 18;

/** Build the EVM transaction params for the priority fee. */
export function buildEvmPriorityTx(chainId: number, asset: PaymentAsset) {
  if (asset === "stable") {
    const usdc = USDC_ADDRESSES[chainId];
    if (!usdc) throw new Error("USDC not configured for this chain");
    const decimals = USDC_DECIMALS[chainId];
    const amount = parseUnits(PRIORITY_FEE_USD.toString(), decimals);
    return {
      kind: "erc20" as const,
      address: usdc,
      abi: erc20Abi,
      functionName: "transfer" as const,
      args: [EVM_ADMIN_ADDRESS, amount] as const,
      assetSymbol: "USDC",
      humanAmount: PRIORITY_FEE_USD.toString(),
    };
  }
  const price = NATIVE_USD_PRICE_FALLBACK[chainId] ?? 1;
  const native = PRIORITY_FEE_USD / price;
  return {
    kind: "native" as const,
    to: EVM_ADMIN_ADDRESS,
    value: parseUnits(native.toFixed(NATIVE_DECIMALS), NATIVE_DECIMALS),
    assetSymbol: NATIVE_SYMBOLS[chainId] || "NATIVE",
    humanAmount: native.toFixed(6),
  };
}

export async function payPriorityFeeTron(asset: PaymentAsset): Promise<PaymentResult> {
  const tronWeb = getTronWeb();
  if (!tronWeb || !tronWeb.defaultAddress?.base58) {
    throw new Error("TronLink not connected");
  }

  if (asset === "stable") {
    const contract = await tronWeb.contract().at(USDT_TRC20_ADDRESS);
    const amount = Math.round(PRIORITY_FEE_USD * 10 ** USDT_TRC20_DECIMALS);
    const tx = await contract.transfer(TRON_ADMIN_ADDRESS, amount).send();
    return { txHash: tx, asset: "USDT", amountPaid: PRIORITY_FEE_USD.toString(), chain: "tron" };
  }

  const trxAmount = PRIORITY_FEE_USD / TRX_USD_PRICE_FALLBACK;
  const sun = Math.round(trxAmount * 1_000_000);
  const tx = await tronWeb.trx.sendTransaction(TRON_ADMIN_ADDRESS, sun);
  if (!tx?.result) throw new Error("TRON transfer failed");
  return {
    txHash: tx.txid || tx.transaction?.txID,
    asset: "TRX",
    amountPaid: trxAmount.toFixed(2),
    chain: "tron",
  };
}
