import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, X, Circle, ShieldAlert } from "lucide-react";
import { cn } from "../../utils/cn";
import type { RequirementStatus, RiskLevel } from "../../data/intelligenceData";

// --------------------------------------------------- requirement status

export const requirementStatusConfig: Record<
  RequirementStatus,
  { label: string; short: string; glyph: string; classes: string; dot: string; icon: ReactNode }
> = {
  compliant: {
    label: "Compliant",
    short: "Compliant",
    glyph: "✓",
    classes: "bg-[#eaf3ea] text-[#2f6b3a] border-[#c9e2cb]",
    dot: "#2f6b3a",
    icon: <Check size={13} strokeWidth={2.6} />,
  },
  "needs-review": {
    label: "Needs Review",
    short: "Needs Review",
    glyph: "⚠",
    classes: "bg-[#fbf1e0] text-[#9c6b1a] border-[#f0dcb2]",
    dot: "#9c6b1a",
    icon: <AlertTriangle size={13} />,
  },
  "non-compliant": {
    label: "Non-Compliant",
    short: "Non-Compliant",
    glyph: "✕",
    classes: "bg-[#f8e9e9] text-[#9c3131] border-[#f0c9c9]",
    dot: "#9c3131",
    icon: <X size={13} strokeWidth={2.6} />,
  },
  missing: {
    label: "Missing Evidence",
    short: "Missing",
    glyph: "○",
    classes: "bg-[#f1ece2] text-[#7a6a55] border-[#e0d6c5]",
    dot: "#7a6a55",
    icon: <Circle size={12} />,
  },
};

export function StatusPill({
  status,
  label,
  className,
}: {
  status: RequirementStatus;
  label?: string;
  className?: string;
}) {
  const cfg = requirementStatusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        cfg.classes,
        className
      )}
    >
      {cfg.icon}
      {label ?? cfg.label}
    </span>
  );
}

export function StatusGlyph({ status, className }: { status: RequirementStatus; className?: string }) {
  const cfg = requirementStatusConfig[status];
  return (
    <span
      className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold", cfg.classes, className)}
      title={cfg.label}
      aria-label={cfg.label}
    >
      {cfg.glyph}
    </span>
  );
}

// ------------------------------------------------------------- risk

export const riskConfig: Record<RiskLevel, { label: string; classes: string; bar: string }> = {
  low: { label: "Low Risk", classes: "bg-[#eaf3ea] text-[#2f6b3a] border-[#c9e2cb]", bar: "#2f6b3a" },
  medium: { label: "Medium Risk", classes: "bg-[#fbf1e0] text-[#9c6b1a] border-[#f0dcb2]", bar: "#9c6b1a" },
  high: { label: "High Risk", classes: "bg-[#f8e9e9] text-[#9c3131] border-[#f0c9c9]", bar: "#9c3131" },
};

export function RiskPill({ level, label, className }: { level: RiskLevel; label?: string; className?: string }) {
  const cfg = riskConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        cfg.classes,
        className
      )}
    >
      <ShieldAlert size={13} />
      {label ?? cfg.label}
    </span>
  );
}

// --------------------------------------------------------- small parts

export function EngineTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#e0d6c5] bg-[#faf8f4] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#8a7c68]">
      {children}
    </span>
  );
}

export function FieldBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a4977f]">{label}</p>
      <div className="mt-1 text-sm text-[#3d2b1f]">{children}</div>
    </div>
  );
}

export function MandatoryTag({ mandatory }: { mandatory: boolean }) {
  return mandatory ? (
    <span className="inline-flex items-center rounded-full border border-[#e0d6c5] bg-[#f6f1e8] px-2 py-0.5 text-[11px] font-medium text-[#7a5510]">
      Mandatory
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-[#e5ded1] bg-[#faf8f4] px-2 py-0.5 text-[11px] font-medium text-[#8a7c68]">
      Optional
    </span>
  );
}

// ------------------------------------------------------------ drawer

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.aside
            className="flex h-full w-full max-w-[520px] flex-col border-l border-[#e5ded1] bg-[#fbf9f5] shadow-[-24px_0_60px_rgba(90,74,54,0.16)]"
            initial={{ x: 40, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 border-b border-[#e5ded1] bg-white px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#3d2b1f]">{title}</h2>
                {subtitle && <p className="mt-0.5 text-sm text-[#8a7c68]">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="rounded-full p-1.5 text-[#8a7c68] transition-colors hover:bg-[#f3ebdf] hover:text-[#3d2b1f]"
              >
                <X size={18} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="border-t border-[#e5ded1] bg-white px-6 py-4">{footer}</div>}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ------------------------------------------------------- count tiles

export function CountTile({
  label,
  value,
  tone = "neutral",
  emphasise,
}: {
  label: string;
  value: number | string;
  tone?: "neutral" | "green" | "amber" | "red" | "muted";
  emphasise?: boolean;
}) {
  const tones: Record<string, string> = {
    neutral: "text-[#3d2b1f]",
    green: "text-[#2f6b3a]",
    amber: "text-[#9c6b1a]",
    red: "text-[#9c3131]",
    muted: "text-[#7a6a55]",
  };
  return (
    <div className={cn("bg-white p-5", emphasise && Number(value) > 0 && "bg-[#fdf4f4]")}>
      <p className={cn("text-2xl font-semibold tracking-tight", tones[tone])}>{value}</p>
      <p className="mt-1 text-sm text-[#6b5c4a]">{label}</p>
    </div>
  );
}
