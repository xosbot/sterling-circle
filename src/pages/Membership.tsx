import { Link } from "react-router-dom";
import { Check, Crown, Diamond, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import MembersOnlyBanner from "@/components/MembersOnlyBanner";

const tiers = [
  {
    icon: Gem,
    name: "Initiate",
    sub: "Verified · Whitelisted",
    note: "Entry tier · Annual contribution starting at 5 ETH",
    perks: [
      "Access to private P2P desk",
      "Curated DeFi vaults (capped allocation)",
      "Obsidian Card · Onyx finish",
      "24/7 concierge — text & voice",
    ],
  },
  {
    icon: Diamond,
    name: "Sovereign",
    sub: "By Recommendation",
    note: "Two existing members must endorse",
    featured: true,
    perks: [
      "Everything in Initiate",
      "Bespoke OTC desk · 8-figure floors",
      "Cross-border settlement corridors",
      "Hardware Vault · Engraved edition",
      "Quarterly private retreats",
    ],
  },
  {
    icon: Crown,
    name: "Noir",
    sub: "By Invitation Only",
    note: "Reserved · Capped at 100 seats globally",
    perks: [
      "Everything in Sovereign",
      "Direct quant council access",
      "Family-office structuring",
      "Inheritance & succession protocols",
      "Private jet & residency desk",
    ],
  },
];

const Membership = () => {
  return (
    <>
      <section className="container-luxe py-24 md:py-32">
        <SectionHeader
          eyebrow="Membership"
          title="Three thresholds. One society."
          description="Membership is never advertised and never sold. It is recognised. Each tier is a deeper passage into the Noir/Vault perimeter."
        />
      </section>

      <section className="container-luxe pb-32">
        <div className="grid lg:grid-cols-3 gap-px bg-border">
          {tiers.map((t, i) => (
            <div
              key={i}
              className={`relative bg-onyx-900 p-10 md:p-12 flex flex-col ${
                t.featured ? "lg:-my-8 bg-onyx-800 shadow-elevated z-10" : ""
              }`}
            >
              {t.featured && (
                <div className="absolute top-0 left-0 right-0 -translate-y-1/2 flex justify-center">
                  <div className="bg-gradient-emerald text-primary-foreground text-[10px] uppercase tracking-[0.3em] px-5 py-1.5">
                    Most Distinguished
                  </div>
                </div>
              )}
              <t.icon className="text-primary mb-6" size={28} />
              <div className="eyebrow mb-2">{t.sub}</div>
              <h3 className="font-display text-4xl mb-4">{t.name}</h3>
              <p className="text-sm text-muted-foreground mb-8">{t.note}</p>

              <ul className="space-y-4 mb-10 flex-1">
                {t.perks.map((p, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <Button asChild variant={t.featured ? "emerald" : "hairline"} size="lg">
                <Link to="/apply">Request Consideration</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="container-luxe pb-32">
        <SectionHeader
          eyebrow="The Passage"
          title="A deliberate, four-stage admittance."
        />
        <div className="mt-16 grid md:grid-cols-4 gap-px bg-border">
          {[
            { n: "01", t: "Submission", d: "Confidential application reviewed by the admissions chamber." },
            { n: "02", t: "Endorsement", d: "Two existing members or a partner family office must vouch." },
            { n: "03", t: "Verification", d: "Source-of-wealth & jurisdictional review by independent counsel." },
            { n: "04", t: "Initiation", d: "Private onboarding, hardware delivery, and concierge handover." },
          ].map((s, i) => (
            <div key={i} className="bg-onyx-900 p-10 hover:bg-onyx-800 transition-colors duration-500">
              <div className="font-display text-5xl text-primary/50 mb-6">{s.n}</div>
              <h4 className="font-display text-2xl mb-3">{s.t}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
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

export default Membership;
