import { Link } from "react-router-dom";
import { ArrowRight, Shield, Globe2, Coins, Lock, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import MembersOnlyBanner from "@/components/MembersOnlyBanner";
import SEO from "@/components/SEO";
import Reveal from "@/components/Reveal";
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

const partners = ["Aave", "Pendle", "Morpho", "Ethena", "Lido", "Maker", "EigenLayer", "Symbiotic", "Ondo", "Karak"];

const Index = () => {
  return (
    <>
      <SEO
        title="The Private Crypto Society"
        description="Noir/Vault is an invitation-only crypto network for sovereign holders. Private P2P, OTC, DeFi, staking, the Obsidian Card and Hardware Vault — across 62 borders, in absolute discretion."
      />

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
        <div className="absolute inset-0 grid-lines opacity-20" />

        {/* Decorative corner marks */}
        <div className="hidden md:block absolute top-32 left-10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
          <div>N 43°44'</div>
          <div>E 7°25'</div>
        </div>
        <div className="hidden md:block absolute top-32 right-10 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 text-right">
          <div>Cycle MMXXV</div>
          <div>Vol. 11</div>
        </div>

        <div className="container-luxe relative z-10 py-32">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8 animate-fade-up">
              <span className="hairline" />
              <span className="eyebrow">By Invitation · Est. MMXXIV</span>
              <span className="hairline" />
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 text-balance animate-fade-up" style={{ animationDelay: "150ms" }}>
              The Private Society for the<br />
              <span className="text-gradient-emerald italic">Sovereign Holders</span> of Digital Wealth.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: "300ms" }}>
              Noir/Vault is an invitation-only network for ultra-premium members.
              P2P, OTC, DeFi, staking and bespoke custody — engineered for those who move quietly across borders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "450ms" }}>
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: "1s" }}>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Descend</div>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* PARTNER MARQUEE */}
      <section className="border-y border-border bg-onyx-900 overflow-hidden">
        <div className="container-luxe py-6 flex items-center gap-12">
          <div className="shrink-0 eyebrow text-muted-foreground hidden md:block">Curated DeFi protocols</div>
          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-onyx-900 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-onyx-900 to-transparent z-10" />
            <div className="flex marquee gap-16 whitespace-nowrap">
              {[...partners, ...partners].map((p, i) => (
                <span key={i} className="font-display text-2xl text-muted-foreground/70 hover:text-primary transition-colors">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-onyx-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div className="container-luxe relative grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 80} className="px-4 md:px-8 py-14 text-center">
              <div className="font-display text-4xl md:text-6xl text-gradient-emerald mb-2">{s.v}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="container-luxe py-32">
        <Reveal>
          <SectionHeader
            eyebrow="Four Pillars"
            title="A complete financial perimeter, hidden in plain sight."
            description="Every primitive of modern crypto finance — refined, audited, and made discreet for our members."
          />
        </Reveal>
        <div className="mt-20 grid md:grid-cols-2 gap-px bg-border">
          {pillars.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="group relative bg-background p-10 md:p-14 transition-colors duration-500 hover:bg-onyx-800 frame-corner h-full">
                <div className="absolute top-10 right-10 text-xs text-muted-foreground tracking-widest font-display">
                  0{i + 1}
                </div>
                <div className="w-12 h-12 mb-8 border border-primary/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-45 transition-all duration-500">
                  <p.icon size={18} className="group-hover:-rotate-45 transition-transform duration-500" />
                </div>
                <h3 className="font-display text-3xl mb-4">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
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
          <Reveal>
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
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-px bg-border">
              {[
                { k: "T+0", v: "Settlement Window" },
                { k: "62", v: "Currencies Supported" },
                { k: "24/7", v: "Concierge Desk" },
                { k: "FATF", v: "Travel-rule Native" },
              ].map((it, i) => (
                <div key={i} className="bg-onyx-900 p-8 hover:bg-onyx-800 transition-colors duration-500">
                  <div className="font-display text-4xl md:text-5xl text-primary mb-2">{it.k}</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{it.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="container-luxe py-32">
        <Reveal>
          <SectionHeader
            eyebrow="The Instruments"
            title="Tangible artifacts of digital sovereignty."
            align="center"
          />
        </Reveal>
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          {[
            { to: "/card", img: card, eyebrow: "The Obsidian Card", title: "A black metal bearer of crypto liquidity." },
            { to: "/wallet", img: wallet, eyebrow: "Hardware Vault", title: "Air-gapped custody, finished like a Swiss complication." },
          ].map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <Link to={p.to} className="group relative overflow-hidden bg-onyx-800 aspect-[4/5] flex flex-col block">
                <img
                  src={p.img}
                  alt={p.eyebrow}
                  loading="lazy"
                  width={1536}
                  height={1024}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx-900 via-onyx-900/40 to-transparent" />
                <div className="absolute top-6 right-6 w-10 h-10 border border-primary/40 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowUpRight size={16} />
                </div>
                <div className="relative mt-auto p-10">
                  <div className="eyebrow mb-3">{p.eyebrow}</div>
                  <h3 className="font-display text-4xl mb-4">{p.title}</h3>
                  <div className="inline-flex items-center gap-2 text-sm text-primary group-hover:gap-4 transition-all">
                    Discover <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="container-luxe pb-32">
        <Reveal>
          <div className="relative glass-panel-elevated noise-overlay px-8 py-16 md:px-20 md:py-24 text-center max-w-4xl mx-auto frame-corner">
            <div className="absolute inset-0 bg-gradient-radial-emerald opacity-30 pointer-events-none" />
            <Sparkles className="mx-auto text-primary mb-8 animate-pulse-glow relative" size={20} />
            <p className="font-display text-2xl md:text-4xl leading-snug text-balance mb-10 relative">
              <span className="text-primary text-5xl leading-none">“</span>
              Noir/Vault is what happens when a private bank, a Swiss vault, and a sovereign DeFi treasury
              decide to operate as one — and only let in the right people.
              <span className="text-primary text-5xl leading-none">”</span>
            </p>
            <div className="flex items-center justify-center gap-4 relative">
              <span className="hairline" />
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Member · Family Office · Geneva
              </div>
              <span className="hairline" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="container-luxe pb-32">
        <Reveal>
          <MembersOnlyBanner />
        </Reveal>
      </section>
    </>
  );
};

export default Index;
