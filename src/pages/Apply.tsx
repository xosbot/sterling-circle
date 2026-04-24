import { useState } from "react";
import { Check, Lock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import SectionHeader from "@/components/SectionHeader";
import SEO from "@/components/SEO";

const Apply = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application received. The admissions chamber will be in touch.");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <SEO
          title="Application Received"
          description="Your file is now with the Noir/Vault admissions chamber. Every application is reviewed by hand."
        />
      <section className="container-luxe py-32 min-h-[70vh] flex items-center">
        <div className="max-w-2xl mx-auto text-center animate-fade-up">
          <div className="w-16 h-16 mx-auto mb-8 border border-primary flex items-center justify-center text-primary">
            <Check size={24} />
          </div>
          <div className="eyebrow mb-5 justify-center flex">Application Received</div>
          <h1 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
            Your file is now with the admissions chamber.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Every application is reviewed by hand. If you are selected for further passage,
            a member of our concierge will reach you privately within seven days.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="container-luxe py-24 md:py-32">
        <SectionHeader
          eyebrow="Apply / Whitelist"
          title="Submit your file. Quietly."
          description="Membership is reviewed by hand. Provide as much or as little as you wish — discretion is mutual from the first letter."
        />
      </section>

      <section className="container-luxe pb-32">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Full name" id="name">
                  <Input id="name" required className="bg-onyx-700 border-border h-12" />
                </Field>
                <Field label="Preferred alias (optional)" id="alias">
                  <Input id="alias" className="bg-onyx-700 border-border h-12" />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Private email" id="email">
                  <Input id="email" type="email" required className="bg-onyx-700 border-border h-12" />
                </Field>
                <Field label="Jurisdiction of residence" id="jurisdiction">
                  <Input id="jurisdiction" required className="bg-onyx-700 border-border h-12" />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Tier of interest" id="tier">
                  <Select>
                    <SelectTrigger className="bg-onyx-700 border-border h-12">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initiate">Initiate</SelectItem>
                      <SelectItem value="sovereign">Sovereign</SelectItem>
                      <SelectItem value="noir">Noir (by invitation)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Estimated digital holdings" id="holdings">
                  <Select>
                    <SelectTrigger className="bg-onyx-700 border-border h-12">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">$250k – $1m</SelectItem>
                      <SelectItem value="2">$1m – $10m</SelectItem>
                      <SelectItem value="3">$10m – $100m</SelectItem>
                      <SelectItem value="4">$100m+</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field label="Endorsing member or family office (if any)" id="endorser">
                <Input id="endorser" className="bg-onyx-700 border-border h-12" />
              </Field>

              <Field label="A note to the admissions chamber" id="note">
                <Textarea
                  id="note"
                  rows={5}
                  className="bg-onyx-700 border-border"
                  placeholder="Tell us, briefly, why Noir/Vault."
                />
              </Field>

              <div className="flex items-start gap-3 text-xs text-muted-foreground">
                <Lock size={14} className="text-primary mt-0.5 shrink-0" />
                <p>
                  All applications are encrypted in transit and stored under the Noir/Vault privacy charter.
                  Your file is read by humans, never sold, never shared.
                </p>
              </div>

              <Button type="submit" variant="emerald" size="xl" className="w-full">
                Submit Application <Send size={16} />
              </Button>
            </form>
          </div>

          <aside className="space-y-8">
            <div className="glass-panel p-8">
              <div className="eyebrow mb-4">Discretion</div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every member of our admissions chamber operates under a binding NDA. We do not advertise our
                membership, our partners, or our gatherings.
              </p>
            </div>
            <div className="glass-panel p-8">
              <div className="eyebrow mb-4">The Passage</div>
              <ol className="space-y-4 text-sm">
                {["Submission", "Endorsement", "Verification", "Initiation"].map((s, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <span className="font-display text-2xl text-primary/70 w-8">{String(i + 1).padStart(2, "0")}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="glass-panel p-8">
              <div className="eyebrow mb-4">Acceptance</div>
              <div className="font-display text-5xl text-gradient-emerald mb-1">0.08%</div>
              <p className="text-xs text-muted-foreground">of applications received in the last cycle.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

const Field = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      {label}
    </Label>
    {children}
  </div>
);

export default Apply;
