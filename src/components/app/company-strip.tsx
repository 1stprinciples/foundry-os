import Link from "next/link";

import { buildWorkspaceHref } from "@/components/app/workspace-href";

type CompanyLink = {
  slug: string;
  name: string;
  day: number;
  stage: string;
};

export function CompanyStrip({
  companies,
  activeSlug,
  path,
}: {
  companies: CompanyLink[];
  activeSlug?: string;
  path: string;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {companies.map((company) => {
        const active = company.slug === activeSlug;

        return (
          <Link
            key={company.slug}
            href={buildWorkspaceHref(path, company.slug)}
            className={[
              "rounded-full border px-4 py-2 text-sm transition",
              active
                ? "border-black bg-black text-white"
                : "border-black/10 bg-white/70 text-black/70 hover:border-black/30 hover:text-black",
            ].join(" ")}
          >
            <span className="font-semibold">{company.name}</span>
            <span className="ml-2 text-xs uppercase tracking-[0.2em] opacity-70">
              Day {company.day} · {company.stage}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
