import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Fingerprint, KeyRound, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/SectionHeader";
import MembersOnlyBanner from "@/components/MembersOnlyBanner";
import SEO from "@/components/SEO";
import Reveal from "@/components/Reveal";
import wallet from "@/assets/wallet.jpg";

const specs = [
  { k: "EAL6+", v: "Secure Element" },
  { k: "Air-gapped", v: "Zero connectivity" },
  { k: "12 / 24", v: "Seed configurations" },
  { k: "Multi-sig", v: "Native 2-of-3, 3-of-5" },
];

const features = [
  { icon: Cpu, t: "Sovereign Silicon", d: "EAL6+ certified secure element with custom firmware audited by three independent labs." },
  { icon: Fingerprint, t: "Biometric Vault", d: "Capacitive print sensor with anti-spoof liveness — unlock without touching glass." },
  { icon: KeyRound, t: "Inheritance Protocol", d: "Time-locked recovery shards distributed across notaries you trust, in jurisdictions you choose." },
  { icon: Layers3, t: "Deniable Storage", d: "Hidden wallets behind a duress PIN. Plausible deniability, by design." },
];

const Wallet = () => {
  return (
    <>
      <SEO
        title="Hardware Vault"
        description="An EAL6+ air-gapped hardware wallet finished like a Swiss watch. Multi-signature, biometric, with inheritance protocol and deniable storage. Custody worthy of generational wealth."
      />

      <section className="relative overflow-hidden">
        <div className="container-luxe py-24 md:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal delay={120}>
            <div className="relative aspect-square bg-onyx-800 overflow-hidden order-last lg:order-first frame-corner">
              <div className="absolute inset-0 bg-gradient-radial-emerald opacity-60 animate-pulse-glow" />
              <img
                src={wallet}
                alt="Hardware vault — air-gapped crypto custody device"
                loading="lazy"
                width={1536}
                height={1024}
                className="absolute inset-0 w-full h-full object-cover animate-float"
              />
            </div>
          </Reveal>

          <Reveal>
            <SectionHeader
              eyebrow="Hardware Vault"
              title="A Swiss complication for digital sovereignty."
              description="Hand-finished in machined titanium. Air-gapped. Multi-signature. Engineered to outlive the trends, the platforms, and possibly you."
            />
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="emerald" size="lg">
                <Link to="/apply">Reserve Yours <ArrowRight /></Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {specs.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="bg-onyx-900 p-10 text-center hover:bg-onyx-800 transition-colors duration-500 h-full">
                <div className="font-display text-3xl md:text-4xl text-gradient-emerald mb-2">{s.k}</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-luxe pb-32">
        <Reveal>
          <SectionHeader eyebrow="Designed for the Paranoid" title="Custody, finally worthy of generational wealth." />
        </Reveal>
        <div className="mt-16 grid md:grid-cols-2 gap-px bg-border">
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="bg-onyx-900 p-10 md:p-14 hover:bg-onyx-800 transition-colors duration-500 h-full frame-corner">
                <f.icon className="text-primary mb-6" size={22} />
                <h3 className="font-display text-3xl mb-4">{f.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.d}</p>
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

export default Wallet;
