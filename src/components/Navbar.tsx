import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "The Network" },
  { to: "/membership", label: "Membership" },
  { to: "/features", label: "Features" },
  { to: "/card", label: "Obsidian Card" },
  { to: "/wallet", label: "Hardware" },
];

const Navbar = () => {
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
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled || open
          ? "bg-onyx-900/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      )}
    >
      <nav className="container-luxe flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rotate-45 border border-primary group-hover:bg-primary/20 transition-colors" />
            <div className="absolute inset-1.5 rotate-45 bg-gradient-emerald" />
          </div>
          <div className="leading-none">
            <div className="font-display text-xl tracking-wider">NOIR<span className="text-primary">/</span>VAULT</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Private Crypto Society</div>
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
                  "text-xs uppercase tracking-[0.2em] transition-colors relative py-1",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-primary" />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button asChild variant="emerald" size="sm">
            <Link to="/apply">Apply for Whitelist</Link>
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
  );
};

export default Navbar;
