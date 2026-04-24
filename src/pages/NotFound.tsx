import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <section className="container-luxe min-h-[80vh] flex flex-col items-center justify-center text-center py-32">
      <div className="eyebrow mb-6">Off the Map</div>
      <h1 className="font-display text-7xl md:text-9xl text-gradient-emerald mb-6">404</h1>
      <p className="text-muted-foreground max-w-md mb-10">
        This corridor does not exist within the Noir/Vault perimeter.
      </p>
      <Button asChild variant="hairline" size="lg">
        <Link to="/">Return to the Society</Link>
      </Button>
    </section>
  );
};

export default NotFound;
