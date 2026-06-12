import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  border?: boolean;
}

export function SectionHeader({
  title,
  description,
  actions,
  className,
  border = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        border && "border-b border-border pb-3 mb-4",
        className
      )}
    >
      <div>
        <h2 className="text-[14px] font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

interface CardSectionProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export function CardSection({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  noPadding,
}: CardSectionProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-1.5">{actions}</div>}
      </div>
      <div className={cn(!noPadding && "p-4", bodyClassName)}>{children}</div>
    </div>
  );
}
