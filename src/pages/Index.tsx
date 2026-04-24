import { Link } from "react-router-dom";
import { ArrowRight, Shield, Globe2, Coins, Lock, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import MembersOnlyBanner from "@/components/MembersOnlyBanner";
import hero from "@/assets/hero.jpg";
import network from "@/assets/network.jpg";
import card from "@/assets/card.jpg";
import wallet from "@/assets/wallet.jpg";

const stats = [
  { v: "2,184", l: "Verified Members" },
  { v: "$4.7B", l: "Settled Volume" },
  { v: "62", l: "Sovereign Borders" },
  { v: "0.08%", l: "Acceptance Rate" },
];

const pillars = [
  {
    icon: Coins,
    title: "Private OTC & P2P",
    desc: "Settle nine-figure positions peer-to-peer with vetted counterparties. No order books. No leaks.",
  },
  {
    icon: Globe2,
    title: "Cross-Border, Frictionless",
    desc: "Move value across 62 jurisdictions with concierge compliance. From Monaco to Singapore in seconds.",
  },
  {
    icon: Shield,
    title: "Institutional-grade DeFi",
    desc: "Curated yield, structured products, and staking — sourced and audited by our quant council.",
  },
  {
    icon: Lock,
    title: "Custody by Design",
    desc: "Air-gapped Obsidian hardware vaults, multi-signature inheritance, and deniable cold storage.",
  },
];

const Index = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img
          src={hero}
          alt="Onyx geometric shapes with emerald glow"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-hero-fade" />
        <div className="absolute inset-0 bg-gradient-radial-emerald opacity-50" />

        <div className="container-luxe relative z-10 py-32">
          <div className="max-w-4xl animate-fade-up">
            <div className="flex items-center gap-3 mb-8">
              <span className="hairline" />
              <span className="eyebrow">By Invitation · Est. MMXXIV</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 text-balance">
              The private society for the
              <span className="text-gradient-emerald italic"> sovereign holders</span> of digital wealth.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
              Noir/Vault is an invitation-only network for ultra-premium members.
              P2P, OTC, DeFi, staking and bespoke custody — engineered for those who move quietly across borders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="emerald" size="xl">
                <Link to="/apply">
                  Apply for Whitelist <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="hairline" size="xl">
                <Link to="/membership">Discover the Society</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* scroll line */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Descend</div>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-onyx-800/50">
        <div className="container-luxe grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {stats.map((s, i) => (
            <div key={i} className="px-4 md:px-8 py-10 text-center">
              <div className="font-display text-3xl md:text-5xl text-gradient-emerald mb-2">{s.v}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="container-luxe py-32">
        <SectionHeader
          eyebrow="Four Pillars"
          title="A complete financial perimeter, hidden in plain sight."
          description="Every primitive of modern crypto finance — refined, audited, and made discreet for our members."
        />
        <div className="mt-20 grid md:grid-cols-2 gap-px bg-border">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="group relative bg-background p-10 md:p-14 transition-colors duration-500 hover:bg-onyx-800"
            >
              <div className="absolute top-10 right-10 text-xs text-muted-foreground tracking-widest">
                0{i + 1}
              </div>
              <div className="w-12 h-12 mb-8 border border-primary/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <p.icon size={18} />
              </div>
              <h3 className="font-display text-3xl mb-4">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CROSS-BORDER */}
      <section className="relative overflow-hidden">
        <img
          src={network}
          alt="Global network map"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />
        <div className="container-luxe relative py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              eyebrow="Cross-Border, Cross-Asset"
              title="Move sovereign value as quietly as breath."
              description="A purpose-built corridor between fiat, stablecoins, and digital assets — across 62 jurisdictions, with full concierge compliance and forensic-grade reporting on demand."
            />
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="emerald" size="lg">
                <Link to="/features">Explore Features <ArrowUpRight /></Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border">
            {[
              { k: "T+0", v: "Settlement Window" },
              { k: "62", v: "Currencies Supported" },
              { k: "24/7", v: "Concierge Desk" },
              { k: "FATF", v: "Travel-rule Native" },
            ].map((it, i) => (
              <div key={i} className="bg-onyx-900 p-8">
                <div className="font-display text-4xl text-primary mb-2">{it.k}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{it.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="container-luxe py-32">
        <SectionHeader
          eyebrow="The Instruments"
          title="Tangible artifacts of digital sovereignty."
          align="center"
        />
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          <Link to="/card" className="group relative overflow-hidden bg-onyx-800 aspect-[4/5] flex flex-col">
            <img
              src={card}
              alt="Obsidian crypto card"
              loading="lazy"
              width={1536}
              height={1024}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-onyx-900 via-onyx-900/40 to-transparent" />
            <div className="relative mt-auto p-10">
              <div className="eyebrow mb-3">The Obsidian Card</div>
              <h3 className="font-display text-4xl mb-4">A black metal bearer of crypto liquidity.</h3>
              <div className="inline-flex items-center gap-2 text-sm text-primary group-hover:gap-4 transition-all">
                Discover <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          <Link to="/wallet" className="group relative overflow-hidden bg-onyx-800 aspect-[4/5] flex flex-col">
            <img
              src={wallet}
              alt="Hardware vault"
              loading="lazy"
              width={1536}
              height={1024}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-onyx-900 via-onyx-900/40 to-transparent" />
            <div className="relative mt-auto p-10">
              <div className="eyebrow mb-3">Hardware Vault</div>
              <h3 className="font-display text-4xl mb-4">Air-gapped custody, finished like a Swiss complication.</h3>
              <div className="inline-flex items-center gap-2 text-sm text-primary group-hover:gap-4 transition-all">
                Discover <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="container-luxe pb-32">
        <div className="relative glass-panel noise-overlay px-8 py-16 md:px-20 md:py-24 text-center max-w-4xl mx-auto">
          <Sparkles className="mx-auto text-primary mb-8" size={20} />
          <p className="font-display text-2xl md:text-4xl leading-snug text-balance mb-10">
            “Noir/Vault is what happens when a private bank, a Swiss vault, and a sovereign DeFi treasury
            decide to operate as one — and only let in the right people.”
          </p>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Member · Family Office · Geneva
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-luxe pb-32">
        <MembersOnlyBanner />
      </section>
    </>
  );
};

export default Index;
