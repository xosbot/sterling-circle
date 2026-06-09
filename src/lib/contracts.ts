// Smart contract helpers — Solidity compile (lazy), EVM read/write/deploy, TRON read/write/deploy.
import {
  type Abi,
  type AbiFunction,
  type AbiParameter,
  encodeDeployData,
  isAddress,
} from "viem";
import { getTronWeb } from "@/lib/tron";

/* ---------- Types ---------- */

export type AbiKind = "read" | "write" | "deploy";

export interface CompileResult {
  contractName: string;
  abi: Abi;
  bytecode: string; // 0x-prefixed
}

/* ---------- Solc-js loader (lazy, CDN) ---------- */

let solcPromise: Promise<any> | null = null;
const SOLC_VERSION = "soljson-v0.8.26+commit.8a97fa7a.js";
const SOLC_URL = `https://binaries.soliditylang.org/bin/${SOLC_VERSION}`;

declare global {
  interface Window {
    Module?: any;
    Solc?: any;
  }
}

/** Loads solc-js from the official CDN on first call. ~3MB. */
export function loadSolc(): Promise<any> {
  if (solcPromise) return solcPromise;
  solcPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-solc="1"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).Module));
      existing.addEventListener("error", () => reject(new Error("Failed to load Solidity compiler")));
      return;
    }
    const script = document.createElement("script");
    script.src = SOLC_URL;
    script.async = true;
    script.dataset.solc = "1";
    script.onload = () => {
      // soljson exposes a global `Module` with `cwrap`, used by solc-js.
      // We use the lower-level `_solidity_compile` function directly.
      resolve((window as any).Module);
    };
    script.onerror = () => reject(new Error("Failed to load Solidity compiler from binaries.soliditylang.org"));
    document.head.appendChild(script);
  });
  return solcPromise;
}

/** Compile a single Solidity source string. Returns the first contract found. */
export async function compileSolidity(source: string, contractFile = "Contract.sol"): Promise<CompileResult[]> {
  const Module = await loadSolc();
  const compile = Module.cwrap("solidity_compile", "string", ["string", "number"]);

  const input = {
    language: "Solidity",
    sources: { [contractFile]: { content: source } },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
    },
  };

  const outputJson = compile(JSON.stringify(input), 0);
  const output = JSON.parse(outputJson);

  if (output.errors) {
    const fatal = output.errors.filter((e: any) => e.severity === "error");
    if (fatal.length) throw new Error(fatal.map((e: any) => e.formattedMessage || e.message).join("\n"));
  }

  const contracts = output.contracts?.[contractFile] || {};
  const results: CompileResult[] = [];
  for (const [name, c] of Object.entries<any>(contracts)) {
    results.push({
      contractName: name,
      abi: c.abi as Abi,
      bytecode: "0x" + c.evm.bytecode.object,
    });
  }
  if (!results.length) throw new Error("Compilation produced no contracts.");
  return results;
}

/* ---------- ABI helpers ---------- */

export function parseAbi(raw: string): Abi {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("ABI is empty");
  let parsed: any;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error("ABI must be valid JSON");
  }
  // Some block explorers return `{ result: "[...]" }` or wrapped artifacts
  if (typeof parsed === "string") parsed = JSON.parse(parsed);
  if (parsed.abi) parsed = parsed.abi;
  if (!Array.isArray(parsed)) throw new Error("ABI must be an array");
  return parsed as Abi;
}

export function listFunctions(abi: Abi): AbiFunction[] {
  return abi.filter((i): i is AbiFunction => i.type === "function");
}

export function isReadFunction(fn: AbiFunction) {
  return fn.stateMutability === "view" || fn.stateMutability === "pure";
}

/** Cast a user-typed string into the JS value the function expects. */
export function castInput(param: AbiParameter, raw: string): unknown {
  const t = param.type;
  const v = raw.trim();
  if (t === "bool") return v === "true" || v === "1";
  if (t.startsWith("uint") || t.startsWith("int")) {
    if (!v) return 0n;
    return BigInt(v);
  }
  if (t.endsWith("[]")) {
    // Array — accept JSON or comma-separated
    if (v.startsWith("[")) return JSON.parse(v);
    return v.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (t === "tuple" || t.startsWith("tuple")) {
    return JSON.parse(v);
  }
  return v; // address, string, bytes, etc.
}

export function castInputs(params: readonly AbiParameter[], raws: string[]): unknown[] {
  return params.map((p, i) => castInput(p, raws[i] ?? ""));
}

/** Stringify a result for display + storage. BigInts become decimal strings. */
export function stringifyResult(value: unknown): string {
  return JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? v.toString() : v), 2);
}

/* ---------- TRON deploy ---------- */

export interface TronDeployArgs {
  abi: Abi;
  bytecode: string; // hex, with or without 0x
  args?: unknown[];
  feeLimit?: number; // SUN
  callValue?: number;
  name?: string;
}

export async function tronDeployContract(opts: TronDeployArgs): Promise<{ address: string; txHash: string }> {
  const tronWeb = getTronWeb();
  if (!tronWeb?.defaultAddress?.base58) throw new Error("TronLink not connected");
  const bytecode = opts.bytecode.startsWith("0x") ? opts.bytecode.slice(2) : opts.bytecode;
  const result = await tronWeb.contract().new({
    abi: opts.abi as any,
    bytecode,
    parameters: opts.args ?? [],
    feeLimit: opts.feeLimit ?? 1_000_000_000,
    callValue: opts.callValue ?? 0,
    name: opts.name ?? "Contract",
    userFeePercentage: 100,
    originEnergyLimit: 10_000_000,
  });
  return {
    address: result.address,
    txHash: result.transactionHash || result.txID || "",
  };
}

/* ---------- TRON call ---------- */

export async function tronReadFunction(address: string, abi: Abi, fnName: string, args: unknown[]): Promise<unknown> {
  const tronWeb = getTronWeb();
  if (!tronWeb) throw new Error("TronLink not connected");
  const contract = await tronWeb.contract(abi as any, address);
  const res = await contract[fnName](...args).call();
  return res;
}

export async function tronWriteFunction(
  address: string,
  abi: Abi,
  fnName: string,
  args: unknown[],
  callValue = 0,
  feeLimit = 150_000_000,
): Promise<string> {
  const tronWeb = getTronWeb();
  if (!tronWeb?.defaultAddress?.base58) throw new Error("TronLink not connected");
  const contract = await tronWeb.contract(abi as any, address);
  const tx = await contract[fnName](...args).send({ callValue, feeLimit, shouldPollResponse: false });
  return typeof tx === "string" ? tx : tx.txid || tx.transaction?.txID || "";
}

/* ---------- Misc validators ---------- */

export function isValidEvmAddress(addr: string) {
  return isAddress(addr as `0x${string}`);
}

export function isValidTronAddress(addr: string) {
  // Base58 check via TronWeb if available; else basic format check
  const tw = getTronWeb();
  if (tw?.isAddress) return tw.isAddress(addr);
  return /^T[A-Za-z0-9]{33}$/.test(addr);
}

export function buildEvmDeployData(abi: Abi, bytecode: `0x${string}`, args: unknown[]): `0x${string}` {
  return encodeDeployData({ abi, bytecode, args });
}
