import { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  delta,
  detail,
  accent,
}: {
  label: string;
  value: string;
  delta?: string;
  detail?: string;
  accent?: ReactNode;
}) {
  return (
    <article className="rounded-[1.75rem] border border-black/10 bg-white/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold text-black">{value}</p>
        </div>
        {accent ? <div className="text-black/35">{accent}</div> : null}
      </div>
      {delta || detail ? (
        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-black/55">
          <span>{detail}</span>
          {delta ? (
            <span className="rounded-full bg-[#ff6a00]/10 px-2.5 py-1 text-xs font-semibold text-[#a14500]">
              {delta}
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
