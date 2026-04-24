import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { useMembership } from "@/hooks/useMembership";

const links = [
  { to: "/", label: "The Network" },
  { to: "/membership", label: "Membership" },
  { to: "/features", label: "Features" },
  { to: "/card", label: "Obsidian Card" },
  { to: "/wallet", label: "Hardware" },
];

const Navbar = () => {
  const { isAdmin } = useMembership();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      {/* Announcement bar */}
      <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-emerald text-primary-foreground text-[10px] uppercase tracking-[0.3em] py-1.5 text-center">
        <span className="hidden sm:inline">Cycle MMXXV ·</span> Whitelist now reviewing — <Link to="/apply" className="underline underline-offset-2 ml-1">apply for consideration</Link>
      </div>

      <header
        className={cn(
          "fixed top-[26px] inset-x-0 z-50 transition-all duration-500",
          scrolled || open
            ? "bg-onyx-900/85 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        )}
      >
        <nav className="container-luxe flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rotate-45 border border-primary/60 group-hover:border-primary transition-colors" />
              <div className="absolute inset-1.5 rotate-45 bg-gradient-emerald shadow-glow-emerald" />
              <div className="absolute inset-0 animate-spin-slow opacity-40">
                <div className="absolute inset-0 rotate-45 border border-primary/30" />
              </div>
            </div>
            <div className="leading-none">
              <div className="font-display text-xl tracking-wider">NOIR<span className="text-primary">/</span>VAULT</div>
              <div className="text-[9px] uppercase tracking-[0.32em] text-muted-foreground mt-1">Private Crypto Society</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "text-[11px] uppercase tracking-[0.25em] transition-colors relative py-1 group",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span className={cn(
                      "absolute -bottom-1 left-0 right-0 h-px bg-primary transition-transform duration-500 origin-left",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )} />
                  </>
                )}
              </NavLink>
            ))}
            {isAdmin && (
              <>
                <NavLink to="/admin" className={({ isActive }) =>
                  cn("text-[11px] uppercase tracking-[0.25em] transition-colors py-1 border-b border-primary/40",
                    isActive ? "text-primary" : "text-primary/70 hover:text-primary")
                }>
                  Admin
                </NavLink>
                <NavLink to="/admin/contracts" className={({ isActive }) =>
                  cn("text-[11px] uppercase tracking-[0.25em] transition-colors py-1 border-b border-primary/40",
                    isActive ? "text-primary" : "text-primary/70 hover:text-primary")
                }>
                  Contracts
                </NavLink>
              </>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <ConnectWalletButton compact />
            <Button asChild variant="emerald" size="sm">
              <Link to="/apply">Apply <ArrowRight size={14} /></Link>
            </Button>
          </div>

          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {open && (
          <div className="lg:hidden border-t border-border bg-onyx-900/95 backdrop-blur-xl">
            <div className="container-luxe py-6 flex flex-col gap-5">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "text-sm uppercase tracking-[0.2em]",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Button asChild variant="emerald" size="sm" className="mt-2 self-start">
                <Link to="/apply">Apply for Whitelist</Link>
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
