import { SiteFrame } from "@/components/public/site-frame";

export default function PrivacyPage() {
  return (
    <SiteFrame>
      <section className="mx-auto max-w-4xl py-10">
        <div className="section-card legal-copy">
          <p className="eyebrow">Privacy</p>
          <h1 className="mt-4 font-display text-5xl text-white">
            Privacy policy
          </h1>
          <p>
            Foundry OS collects account details, workspace metadata, operating
            logs, and integration events required to deliver the product. We use
            that data to authenticate users, run agent workflows, surface
            analytics, and improve system reliability.
          </p>
          <h2>What we store</h2>
          <p>
            Stored information may include your email, company profile data,
            connected tool metadata, generated documents, task history, and
            activity logs tied to your workspace.
          </p>
          <h2>How we use it</h2>
          <p>
            We use your data to operate Foundry, secure the platform, prevent
            abuse, and provide a historical record of autonomous work carried
            out in your companies.
          </p>
          <h2>Control</h2>
          <p>
            You may request access to, export of, or deletion of your account
            data subject to legal and security requirements.
          </p>
        </div>
      </section>
    </SiteFrame>
  );
}
