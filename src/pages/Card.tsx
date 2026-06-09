import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, Plane, Hotel, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import MembersOnlyBanner from "@/components/MembersOnlyBanner";
import SEO from "@/components/SEO";
import Reveal from "@/components/Reveal";
import card from "@/assets/card.jpg";

const perks = [
  { icon: Plane, t: "Concierge & Travel", d: "Private aviation desk, residency advisory, global lounge access." },
  { icon: Hotel, t: "Sanctuaries", d: "Pre-cleared check-in at over 800 partner hotels and member residences." },
  { icon: Diamond, t: "Acquisitions", d: "Discreet desks for art, watches, real estate and rare assets." },
  { icon: CreditCard, t: "Spend in Crypto", d: "Convert BTC, ETH or stablecoins to fiat at the moment of transaction." },
];

const Card = () => {
  return (
    <>
      <SEO
        title="The Obsidian Card"
        description="A 22-gram brushed black titanium crypto card backed by member liquidity. 0% FX markup, 5% stablecoin cashback, accepted anywhere Mastercard is. Reserved for Noir/Vault members."
      />

      <section className="relative overflow-hidden">
        <div className="container-luxe py-24 md:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <SectionHeader
              eyebrow="The Obsidian Card"
              title="Cast in metal. Backed by liquidity. Spent in silence."
              description="A 22-gram brushed black titanium card that draws against your crypto holdings — anywhere Mastercard is accepted, in any currency."
            />
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="emerald" size="lg">
                <Link to="/apply">Request Yours <ArrowRight /></Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative aspect-square bg-onyx-800 overflow-hidden frame-corner">
              <div className="absolute inset-0 bg-gradient-radial-emerald opacity-60 animate-pulse-glow" />
              <img
                src={card}
                alt="Obsidian crypto card in matte black"
                loading="lazy"
                width={1536}
                height={1024}
                className="absolute inset-0 w-full h-full object-cover animate-float"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe pb-32">
        <div className="grid md:grid-cols-4 gap-px bg-border">
          {[
            { k: "0%", v: "FX Markup" },
            { k: "0%", v: "Crypto Settlement Fee" },
            { k: "5%", v: "Stablecoin Cashback" },
            { k: "∞", v: "Spending Limit" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="bg-onyx-900 p-10 text-center hover:bg-onyx-800 transition-colors duration-500 h-full">
                <div className="font-display text-5xl text-gradient-emerald mb-2">{s.k}</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-luxe pb-32">
        <Reveal>
          <SectionHeader eyebrow="Beyond the Card" title="Privileges woven into every transaction." />
        </Reveal>
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {perks.map((p, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="bg-onyx-900 p-10 hover:bg-onyx-800 transition-colors duration-500 h-full frame-corner">
                <p.icon className="text-primary mb-6" size={20} />
                <h3 className="font-display text-2xl mb-3">{p.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-luxe pb-32">
        <Reveal>
          <MembersOnlyBanner />
        </Reveal>
      </section>
    </>
  );
};

export default Card;
