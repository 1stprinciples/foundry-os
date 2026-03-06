"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { SiteFrame } from "@/components/public/site-frame";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("operator@foundry.local");
  const [magicLink, setMagicLink] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    async function consumeToken() {
      setLoading(true);
      setStatus("Activating magic link...");

      try {
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("This link is invalid or expired.");
        }

        if (!cancelled) {
          setStatus("Session created. Opening the workspace...");
          router.replace("/dashboard");
        }
      } catch (error) {
        if (!cancelled) {
          setStatus(
            error instanceof Error ? error.message : "Unable to consume link.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void consumeToken();

    return () => {
      cancelled = true;
    };
  }, [router, token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    setMagicLink(null);

    try {
      const response = await fetch("/api/auth/magic-link/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Unable to generate a Foundry magic link.");
      }

      const payload = (await response.json()) as { magicLink?: string; message?: string };
      setMagicLink(payload.magicLink ?? null);
      setStatus(payload.message ?? "Magic link generated.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to generate a link.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteFrame>
      <section className="mx-auto max-w-4xl py-10">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="section-card">
            <p className="eyebrow">Foundry Access</p>
            <h1 className="mt-4 font-display text-5xl text-white">
              Sign in with a magic link.
            </h1>
            <p className="mt-6 text-base leading-8 text-neutral-300">
              No password maze. Enter your email and Foundry will mint a secure
              link so you can jump straight into the operating console.
            </p>
            <div className="mt-8 space-y-3 text-sm text-neutral-400">
              <p>1. Enter your work email</p>
              <p>2. Generate a local sign-in link</p>
              <p>3. Open the dashboard and start a cycle</p>
            </div>
          </div>

          <div className="section-card">
            <p className="eyebrow">Request access</p>
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-3 text-sm text-neutral-300">
                Email
                <input
                  className="rounded-[1.35rem] border border-white/10 bg-black/30 px-4 py-4 text-base text-white outline-none transition focus:border-[#ff7a1a]/60"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="operator@yourcompany.com"
                  required
                  type="email"
                  value={email}
                />
              </label>
              <button
                className="cta-primary w-full justify-center px-5 py-4"
                disabled={loading}
                type="submit"
              >
                {loading ? "Generating..." : "Send the link"}
              </button>
            </form>

            {status ? (
              <p className="mt-5 text-sm leading-7 text-neutral-300">{status}</p>
            ) : null}

            {magicLink ? (
              <div className="mt-6 rounded-[1.5rem] border border-[#ff7a1a]/30 bg-[#ff7a1a]/10 p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#ffb37e]">
                  Local magic link
                </p>
                <p className="mt-3 break-all text-sm text-white">{magicLink}</p>
                <div className="mt-4">
                  <Link className="cta-primary px-5 py-3" href={magicLink}>
                    Open generated link
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="cta-secondary px-5 py-3" href="/new">
                Start a company
              </Link>
              <Link className="cta-secondary px-5 py-3" href="/live">
                Inspect live activity
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
