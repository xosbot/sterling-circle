import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const MembersOnlyBanner = () => (
  <div className="relative overflow-hidden glass-panel">
    <div className="absolute inset-0 bg-gradient-radial-emerald opacity-50" />
    <div className="relative px-8 py-10 md:px-14 md:py-14 flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
      <div className="flex items-start gap-5 max-w-2xl">
        <div className="shrink-0 w-12 h-12 border border-primary/40 flex items-center justify-center text-primary">
          <Lock size={18} />
        </div>
        <div>
          <div className="eyebrow mb-2">Members Only</div>
          <h3 className="font-display text-2xl md:text-3xl mb-2">
            Active features are reserved for whitelisted members.
          </h3>
          <p className="text-sm text-muted-foreground">
            What you see here is a window into our world. The vault opens only by invitation.
          </p>
        </div>
      </div>
      <Button asChild variant="emerald" size="lg">
        <Link to="/apply">Apply for Whitelist</Link>
      </Button>
    </div>
  </div>
);

export default MembersOnlyBanner;
