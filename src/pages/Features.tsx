import { Coins, Repeat, TrendingUp, Lock, Globe2, Layers, Banknote, ShieldCheck } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import MembersOnlyBanner from "@/components/MembersOnlyBanner";
import SEO from "@/components/SEO";
import Reveal from "@/components/Reveal";

const features = [
  { icon: Repeat, name: "P2P Liquidity", d: "Match anonymously with vetted counterparties. Settle in stablecoins, BTC, ETH, or fiat rails." },
  { icon: Coins, name: "Private OTC", d: "Block trades from $250k to $250m+, executed off-book by our trading chamber." },
  { icon: TrendingUp, name: "DeFi Curated", d: "Whitelisted strategies on Aave, Pendle, Morpho, Ethena — risk-rated by our council." },
  { icon: Layers, name: "Sovereign Staking", d: "Validator-grade staking on ETH, SOL, ATOM and Berachain with insurance wraps." },
  { icon: Globe2, name: "Cross-Border Rails", d: "Move value across 62 jurisdictions with built-in travel-rule compliance." },
  { icon: Banknote, name: "Spend Anywhere", d: "The Obsidian Card converts crypto to fiat at the moment of transaction. Globally." },
  { icon: Lock, name: "Air-gapped Custody", d: "Hardware Vault with multi-sig, geographic distribution and inheritance protocols." },
  { icon: ShieldCheck, name: "Concierge Compliance", d: "A dedicated counsel for KYC, source-of-wealth and jurisdictional structuring." },
];

const Features = () => {
  return (
    <>
      <SEO
        title="Features & Capabilities"
        description="Private P2P, OTC block trading, curated DeFi, sovereign staking, cross-border rails and air-gapped custody — every primitive of modern crypto finance, refined for Noir/Vault members."
      />

      <section className="container-luxe py-24 md:py-32">
        <Reveal>
          <SectionHeader
            eyebrow="Features"
            title="Every primitive of modern crypto, refined for the discerning."
            description="The full Noir/Vault perimeter — visible to all, accessible only to whitelisted members."
          />
        </Reveal>
      </section>

      <section className="container-luxe pb-32">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {features.map((f, i) => (
            <Reveal key={i} delay={(i % 4) * 80}>
              <div className="group bg-onyx-900 p-8 hover:bg-onyx-800 transition-colors duration-500 relative frame-corner h-full">
                <div className="absolute top-6 right-6 text-[10px] text-muted-foreground tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="w-11 h-11 mb-6 border border-primary/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-45 transition-all duration-500">
                  <f.icon size={16} className="group-hover:-rotate-45 transition-transform duration-500" />
                </div>
                <h3 className="font-display text-2xl mb-3">{f.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="container-luxe pb-32">
        <Reveal>
          <SectionHeader
            eyebrow="In Contrast"
            title="What public crypto cannot offer."
          />
        </Reveal>
        <Reveal>
          <div className="mt-16 overflow-hidden border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-onyx-800 text-left">
                  <th className="p-6 font-normal eyebrow">Capability</th>
                  <th className="p-6 font-normal eyebrow text-muted-foreground">Public Exchanges</th>
                  <th className="p-6 font-normal eyebrow text-primary">Noir/Vault</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["9-figure block execution", "Slippage & front-running", "Private chamber · zero footprint"],
                  ["Cross-border settlement", "Banking dependency", "T+0, 62 jurisdictions"],
                  ["Custody assurance", "Custodial · platform risk", "Air-gapped · self-sovereign"],
                  ["Compliance counsel", "Self-managed", "Dedicated counsel per member"],
                  ["Discretion", "Public order books", "Membership-bound NDA"],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-border hover:bg-onyx-800/40 transition-colors">
                    <td className="p-6 font-medium">{row[0]}</td>
                    <td className="p-6 text-muted-foreground">{row[1]}</td>
                    <td className="p-6 text-foreground">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      <section className="container-luxe pb-32">
        <Reveal>
          <MembersOnlyBanner />
        </Reveal>
      </section>
    </>
  );
};

export default Features;
