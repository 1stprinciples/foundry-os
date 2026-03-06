import type { PublicCompanyCard } from "@/lib/types";

import { formatCurrency, formatNumber } from "./data";

type FundTableProps = {
  companies: PublicCompanyCard[];
};

export function FundTable({ companies }: FundTableProps) {
  return (
    <div className="section-card overflow-hidden">
      <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Portfolio Table</p>
          <h2 className="mt-3 font-display text-3xl text-white">
            Public company ledger
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-neutral-300">
          Each company is scored in the same operating rhythm: thesis quality,
          execution density, commercial traction, and compounding potential.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table min-w-full">
          <thead>
            <tr>
              <th>Company</th>
              <th>Stage</th>
              <th>ARR</th>
              <th>Visitors</th>
              <th>Customers</th>
              <th>Day</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.slug}>
                <td>
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{company.name}</span>
                    <span className="text-xs text-neutral-400">
                      {company.tagline}
                    </span>
                  </div>
                </td>
                <td className="capitalize">{company.stage}</td>
                <td>{formatCurrency(company.arrUsd)}</td>
                <td>{formatNumber(company.visitors)}</td>
                <td>{formatNumber(company.customers)}</td>
                <td>{company.day}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
