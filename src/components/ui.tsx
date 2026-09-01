import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, X, Clock, Info } from "lucide-react";
import { cn } from "../utils/cn";
import type { VerificationStatus } from "../data/mockData";

// ---------------- Buttons ----------------
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a5a35] disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary: "bg-[#3d2b1f] text-white hover:bg-[#2b1e15] shadow-sm",
    secondary: "bg-white text-[#3d2b1f] border border-[#d8cfc2] hover:bg-[#f7f3ec]",
    outline: "bg-transparent text-[#3d2b1f] border border-[#3d2b1f] hover:bg-[#3d2b1f]/5",
    ghost: "bg-transparent text-[#5b4a3a] hover:bg-[#f1ece2]",
    danger: "bg-[#8c2f2f] text-white hover:bg-[#752525]",
  };
  const sizes: Record<string, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-6 py-3",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

// ---------------- Status Badge ----------------
type ActivityPreset = "green" | "orange" | "red";

export function ActivityBadge({
  preset = "green",
  label = "Activity status",
  className,
  size = "sm",
}: {
  preset?: ActivityPreset;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const colors: Record<ActivityPreset, { dot: string; glow: string }> = {
    green: { dot: "#31EE33", glow: "rgba(49, 238, 51, 0.28)" },
    orange: { dot: "#FFBB00", glow: "rgba(255, 187, 0, 0.24)" },
    red: { dot: "#FF0000", glow: "rgba(255, 0, 0, 0.24)" },
  };

  const sizeMap = {
    sm: { outer: 16, dot: 8 },
    md: { outer: 18, dot: 10 },
    lg: { outer: 20, dot: 12 },
  };

  const { outer, dot } = sizeMap[size];
  const active = colors[preset];

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: outer, height: outer }}
      role="img"
      aria-label={label}
      title={label}
    >
      <motion.span
        className="absolute rounded-full"
        style={{ width: outer, height: outer, background: active.glow }}
        animate={{ opacity: [0.1, 0.8, 0.1], scale: [1, 1.7, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute rounded-full"
        style={{ width: outer, height: outer, background: active.glow, filter: "blur(8px)" }}
        animate={{ opacity: [0.15, 0.4, 0.15], scale: [0.85, 1.3, 0.85] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.1 }}
      />
      <span
        className="relative rounded-full"
        style={{ width: dot, height: dot, background: active.dot, boxShadow: `0 0 10px ${active.glow}` }}
      />
    </div>
  );
}

const statusConfig: Record<VerificationStatus, { label: string; preset: ActivityPreset; classes: string; icon: ReactNode }> = {
  verified: { label: "Verified", preset: "green", classes: "bg-[#eaf3ea] text-[#2f6b3a] border-[#c9e2cb]", icon: <Check size={13} strokeWidth={2.5} /> },
  pending: { label: "Verification Pending", preset: "orange", classes: "bg-[#f8efe4] text-[#9c6b1a] border-[#eed4a5]", icon: <Clock size={13} /> },
  warning: { label: "Needs Review", preset: "orange", classes: "bg-[#fbf1e0] text-[#9c6b1a] border-[#f0dcb2]", icon: <AlertTriangle size={13} /> },
  failed: { label: "Issue Found", preset: "red", classes: "bg-[#f8e9e9] text-[#9c3131] border-[#f0c9c9]", icon: <X size={13} /> },
};

export function StatusBadge({ status, label }: { status: VerificationStatus; label?: string }) {
  const cfg = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", cfg.classes)}>
      <ActivityBadge preset={cfg.preset} size="sm" className="shrink-0" />
      {label ?? cfg.label}
    </span>
  );
}

export function TenderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { preset: ActivityPreset; classes: string }> = {
    Open: { preset: "green", classes: "bg-[#eaf3ea] text-[#2f6b3a] border-[#c9e2cb]" },
    "Under Evaluation": { preset: "orange", classes: "bg-[#eef2fb] text-[#3a5a9c] border-[#cdd9f0]" },
    Closed: { preset: "orange", classes: "bg-[#f1ece2] text-[#7a6a55] border-[#e0d6c5]" },
    Awarded: { preset: "green", classes: "bg-[#f4ecf9] text-[#6b3a9c] border-[#e2cdf0]" },
  };
  const config = map[status] ?? { preset: "orange", classes: "bg-gray-100 text-gray-600 border-gray-200" };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", config.classes)}>
      <ActivityBadge preset={config.preset} size="sm" className="shrink-0" />
      {status}
    </span>
  );
}

// ---------------- Compliance Score ----------------
export function ComplianceScore({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const color = value >= 90 ? "#2f6b3a" : value >= 75 ? "#9c6b1a" : "#9c3131";
  const dims = size === "lg" ? 120 : size === "md" ? 88 : 56;
  const stroke = size === "lg" ? 8 : 6;
  const radius = (dims - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: dims, height: dims }}>
      <svg width={dims} height={dims} className="-rotate-90">
        <circle cx={dims / 2} cy={dims / 2} r={radius} stroke="#eee7da" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={dims / 2}
          cy={dims / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <span className={cn("absolute font-semibold", size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm")} style={{ color }}>
        {value}%
      </span>
    </div>
  );
}

// ---------------- Timeline ----------------
export interface TimelineStep {
  label: string;
  state: "done" | "current" | "upcoming";
}
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <li key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs",
                step.state === "done" && "bg-[#2f6b3a] border-[#2f6b3a] text-white",
                step.state === "current" && "border-[#8a5a35] text-[#8a5a35] bg-[#f7f0e6]",
                step.state === "upcoming" && "border-[#dcd3c4] text-[#b3a892]"
              )}
            >
              {step.state === "done" ? <Check size={13} strokeWidth={3} /> : step.state === "current" ? "●" : "○"}
            </span>
            {i < steps.length - 1 && <span className={cn("w-px flex-1 my-1", step.state === "done" ? "bg-[#2f6b3a]" : "bg-[#e2d9c9]")} style={{ minHeight: 24 }} />}
          </div>
          <div className="pb-6">
            <p className={cn("text-sm font-medium", step.state === "upcoming" ? "text-[#b3a892]" : "text-[#3d2b1f]")}>{step.label}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ---------------- Confirmation Modal ----------------
export function ConfirmationModal({
  open,
  title,
  description,
  children,
  onCancel,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger,
}: {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="w-full max-w-md rounded-lg border border-[#e5ded1] bg-white p-6 shadow-xl"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <h3 id="modal-title" className="text-xl font-semibold text-[#3d2b1f]">
              {title}
            </h3>
            {description && <p className="mt-2 text-sm text-[#6b5c4a]">{description}</p>}
            {children && <div className="mt-4">{children}</div>}
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------- Empty State ----------------
export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#e0d6c5] bg-[#faf8f4] py-16 text-center">
      {icon ?? <Info className="text-[#b3a892]" size={28} />}
      <p className="font-medium text-[#3d2b1f]">{title}</p>
      {description && <p className="max-w-sm text-sm text-[#8a7c68]">{description}</p>}
    </div>
  );
}

// ---------------- Page shell ----------------
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("mx-auto w-full max-w-[1240px] px-6 py-10 lg:px-10", className)}
    >
      {children}
    </motion.div>
  );
}

export function SectionCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-[#e5ded1] bg-white p-6", className)}>{children}</div>;
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border px-4 py-3 text-sm",
        tone === "info" ? "border-[#d8cfc2] bg-[#f7f3ec] text-[#5b4a3a]" : "border-[#f0dcb2] bg-[#fbf1e0] text-[#7a5510]"
      )}
    >
      <Info size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  rowClassName,
}: {
  columns: Array<{
    key: string;
    header: string;
    className?: string;
    render?: (row: T) => ReactNode;
  }>;
  rows: T[];
  getRowKey: (row: T) => string;
  rowClassName?: (row: T) => string;
}) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e5ded1] bg-white shadow-[0_12px_30px_rgba(90,74,54,0.05)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-[#3d2b1f]">
          <thead>
            <tr className="bg-[#f8f3ee] text-[11px] uppercase tracking-[0.12em] text-[#8a7c68]">
              {columns.map((column) => (
                <th key={column.key} className={cn("border-b border-[#e8e0d6] px-5 py-3.5 font-medium", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className={cn("border-b border-[#f0ebe0] transition-colors last:border-0 hover:bg-[#faf8f4]", rowClassName?.(row))}
              >
                {columns.map((column) => (
                  <td key={`${getRowKey(row)}-${column.key}`} className={cn("px-5 py-4 align-middle text-[#5b4a3a]", column.className)}>
                    {column.render ? column.render(row) : (row as Record<string, unknown>)[column.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
