import type { Metadata } from "next";

import { FormShell } from "@/components/forms/FormShell";
import { RequestCarForm } from "@/components/forms/RequestCarForm";
import { ActionLink } from "@/components/ui/ActionLink";

export const metadata: Metadata = {
  title: "Request a Car",
  description: "Tell JK_AUTOS what car you need and continue your request on WhatsApp.",
};

export default function RequestCarPage() {
  return (
    <FormShell
      eyebrow="Personal sourcing"
      title="Tell us what you’re looking for."
      description="Share your preferred car and budget. We’ll continue the conversation directly on WhatsApp."
      asideTitle="What happens next?"
      asideDescription="No account or online payment is needed."
      steps={["Complete your preferences.", "Review the message in WhatsApp.", "JK_AUTOS discusses suitable options with you."]}
      mobileAction={<ActionLink href="#request-fullName" fullWidth>Start your request</ActionLink>}
    >
      <RequestCarForm />
    </FormShell>
  );
}
