type Tone = "default" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  default: "border-black/10 bg-black/5 text-black/75",
  success: "border-emerald-600/20 bg-emerald-500/10 text-emerald-800",
  warning: "border-amber-600/20 bg-amber-500/10 text-amber-800",
  danger: "border-rose-600/20 bg-rose-500/10 text-rose-800",
  info: "border-sky-600/20 bg-sky-500/10 text-sky-800",
};

export function StatusPill({
  label,
  tone = "default",
}: {
  label: string;
  tone?: Tone;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
        toneClasses[tone],
      ].join(" ")}
    >
      {label}
    </span>
  );
}
