import { Check, Minus, Crown, Diamond, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

type Cell = boolean | string;

interface Row {
  category: string;
  feature: string;
  initiate: Cell;
  sovereign: Cell;
  noir: Cell;
}

const rows: Row[] = [
  // Eligibility
  { category: "Eligibility", feature: "Minimum digital holdings", initiate: "$250k", sovereign: "$5m", noir: "$50m+" },
  { category: "Eligibility", feature: "Annual contribution", initiate: "5 ETH", sovereign: "25 ETH", noir: "By assessment" },
  { category: "Eligibility", feature: "Endorsement required", initiate: "1 member", sovereign: "2 members", noir: "Invitation only" },
  { category: "Eligibility", feature: "Source-of-wealth review", initiate: true, sovereign: true, noir: true },
  { category: "Eligibility", feature: "Global seats available", initiate: "4,000", sovereign: "900", noir: "100" },

  // Trading
  { category: "Trading", feature: "Private P2P desk", initiate: true, sovereign: true, noir: true },
  { category: "Trading", feature: "OTC block size", initiate: "Up to $1m", sovereign: "$1m – $50m", noir: "Unlimited" },
  { category: "Trading", feature: "Dedicated execution chamber", initiate: false, sovereign: true, noir: true },
  { category: "Trading", feature: "Cross-border settlement (62 jurisdictions)", initiate: "T+1", sovereign: "T+0", noir: "T+0 priority" },

  // DeFi & Yield
  { category: "DeFi & Yield", feature: "Curated DeFi vaults", initiate: "Capped", sovereign: "Full", noir: "Full + bespoke" },
  { category: "DeFi & Yield", feature: "Sovereign-grade staking", initiate: true, sovereign: true, noir: true },
  { category: "DeFi & Yield", feature: "Structured products", initiate: false, sovereign: true, noir: true },
  { category: "DeFi & Yield", feature: "Quant council access", initiate: false, sovereign: "Quarterly", noir: "Direct line" },

  // Custody & Card
  { category: "Custody & Card", feature: "Obsidian Card", initiate: "Onyx finish", sovereign: "Engraved", noir: "Solid noir + monogram" },
  { category: "Custody & Card", feature: "Hardware Vault", initiate: "Standard", sovereign: "Engraved edition", noir: "Hand-finished, numbered" },
  { category: "Custody & Card", feature: "Multi-sig inheritance protocol", initiate: false, sovereign: true, noir: true },

  // Lifestyle
  { category: "Lifestyle", feature: "24/7 concierge", initiate: "Text & voice", sovereign: "Dedicated", noir: "Personal counsel" },
  { category: "Lifestyle", feature: "Private retreats", initiate: false, sovereign: "Quarterly", noir: "Bespoke" },
  { category: "Lifestyle", feature: "Residency & jet desk", initiate: false, sovereign: false, noir: true },
  { category: "Lifestyle", feature: "Family-office structuring", initiate: false, sovereign: false, noir: true },
];

type Tier = { key: string; name: string; icon: typeof Gem; sub: string; featured?: boolean };
const tiers: Tier[] = [
  { key: "initiate", name: "Initiate", icon: Gem, sub: "Verified · Whitelisted" },
  { key: "sovereign", name: "Sovereign", icon: Diamond, sub: "By Recommendation", featured: true },
  { key: "noir", name: "Noir", icon: Crown, sub: "By Invitation" },
];

const renderCell = (val: Cell, featured?: boolean) => {
  if (val === true) {
    return (
      <span className={cn("inline-flex w-7 h-7 items-center justify-center rounded-full",
        featured ? "bg-primary text-primary-foreground" : "border border-primary/40 text-primary")}>
        <Check size={14} />
      </span>
    );
  }
  if (val === false) {
    return (
      <span className="inline-flex w-7 h-7 items-center justify-center text-muted-foreground/40">
        <Minus size={14} />
      </span>
    );
  }
  return (
    <span className={cn("text-sm", featured ? "text-foreground font-medium" : "text-muted-foreground")}>
      {val}
    </span>
  );
};

const TierComparisonTable = () => {
  // Group rows by category
  const grouped = rows.reduce<Record<string, Row[]>>((acc, r) => {
    (acc[r.category] ||= []).push(r);
    return acc;
  }, {});

  return (
    <div className="border border-border bg-onyx-900 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] sticky top-20 z-20 bg-onyx-800/95 backdrop-blur-xl border-b border-border">
        <div className="p-6 hidden md:block">
          <div className="eyebrow">Compare All Benefits</div>
        </div>
        <div className="md:hidden col-span-1 p-4 border-r border-border">
          <div className="eyebrow text-[9px]">Benefit</div>
        </div>
        {tiers.map((t) => (
          <div
            key={t.key}
            className={cn(
              "p-4 md:p-6 text-center border-l border-border relative",
              t.featured && "bg-onyx-900"
            )}
          >
            {t.featured && (
              <div className="absolute -top-px left-0 right-0 h-px bg-gradient-emerald" />
            )}
            <t.icon className={cn("mx-auto mb-2", t.featured ? "text-primary" : "text-muted-foreground")} size={18} />
            <div className="font-display text-lg md:text-2xl">{t.name}</div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 hidden md:block">
              {t.sub}
            </div>
            {t.featured && (
              <div className="mt-2 inline-block text-[9px] uppercase tracking-[0.25em] text-primary">★ Featured</div>
            )}
          </div>
        ))}
      </div>

      {/* Body grouped by category */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] bg-onyx-800/60 border-y border-border">
            <div className="col-span-4 p-4 px-4 md:px-8">
              <div className="flex items-center gap-3">
                <span className="hairline-gold" />
                <span className="eyebrow-gold">{category}</span>
              </div>
            </div>
          </div>
          {items.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.4fr_1fr_1fr_1fr] border-b border-border/60 last:border-b-0 hover:bg-onyx-800/40 transition-colors"
            >
              <div className="p-4 md:p-6 text-sm md:text-base text-foreground/90 font-medium">
                {row.feature}
              </div>
              <div className="p-4 md:p-6 text-center border-l border-border flex items-center justify-center">
                {renderCell(row.initiate)}
              </div>
              <div className="p-4 md:p-6 text-center border-l border-border bg-onyx-900/80 flex items-center justify-center">
                {renderCell(row.sovereign, true)}
              </div>
              <div className="p-4 md:p-6 text-center border-l border-border flex items-center justify-center">
                {renderCell(row.noir)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TierComparisonTable;
