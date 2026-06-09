import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

const SectionHeader = ({ eyebrow, title, description, align = "left", className }: Props) => {
  return (
    <div
      className={cn(
        "max-w-3xl flex flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <div className="flex items-center gap-3">
          <span className="hairline" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-balance">
        {title}
      </h2>
      {description && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
