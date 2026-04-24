import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, Plane, Hotel, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import MembersOnlyBanner from "@/components/MembersOnlyBanner";
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
      <section className="relative overflow-hidden">
        <div className="container-luxe py-24 md:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div>
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
          </div>

          <div className="relative aspect-square bg-onyx-800 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial-emerald opacity-60" />
            <img
              src={card}
              alt="Obsidian crypto card in matte black"
              loading="lazy"
              width={1536}
              height={1024}
              className="absolute inset-0 w-full h-full object-cover animate-float"
            />
          </div>
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
            <div key={i} className="bg-onyx-900 p-10 text-center">
              <div className="font-display text-5xl text-gradient-emerald mb-2">{s.k}</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxe pb-32">
        <SectionHeader eyebrow="Beyond the Card" title="Privileges woven into every transaction." />
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {perks.map((p, i) => (
            <div key={i} className="bg-onyx-900 p-10 hover:bg-onyx-800 transition-colors duration-500">
              <p.icon className="text-primary mb-6" size={20} />
              <h3 className="font-display text-2xl mb-3">{p.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxe pb-32">
        <MembersOnlyBanner />
      </section>
    </>
  );
};

export default Card;
