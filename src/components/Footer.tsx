import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-onyx-900 mt-32">
      <div className="container-luxe py-20 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rotate-45 border border-primary" />
              <div className="absolute inset-1.5 rotate-45 bg-gradient-emerald" />
            </div>
            <div className="font-display text-lg tracking-wider">NOIR<span className="text-primary">/</span>VAULT</div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An invitation-only sanctuary for the world's most discerning holders of digital wealth.
            Discretion is our currency.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-5">Society</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/membership" className="text-muted-foreground hover:text-primary transition-colors">Membership</Link></li>
            <li><Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
            <li><Link to="/card" className="text-muted-foreground hover:text-primary transition-colors">Obsidian Card</Link></li>
            <li><Link to="/wallet" className="text-muted-foreground hover:text-primary transition-colors">Hardware Vault</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-5">Discreet</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/apply" className="text-muted-foreground hover:text-primary transition-colors">Apply / Whitelist</Link></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Concierge</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Press</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Charter</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-luxe py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Noir/Vault Society. All movements reserved.</div>
          <div className="tracking-[0.3em] uppercase">Members · 2,184 of 5,000</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
