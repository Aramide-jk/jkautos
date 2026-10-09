import type { Metadata } from "next";

import { FormShell } from "@/components/forms/FormShell";
import { SellCarForm } from "@/components/forms/SellCarForm";
import { ActionLink } from "@/components/ui/ActionLink";

export const metadata: Metadata = {
  title: "Sell Your Car",
  description: "Share your vehicle details with JK_AUTOS and continue on WhatsApp.",
};

export default function SellCarPage() {
  return (
    <FormShell
      eyebrow="Vehicle brokerage"
      title="Ready to sell your car?"
      description="Give us the essentials, preview your selected photos, then continue securely in WhatsApp."
      asideTitle="A simple first step."
      asideDescription="This is an enquiry, not a guaranteed offer or completed sale."
      steps={["Share accurate vehicle details.", "Continue with JK_AUTOS on WhatsApp.", "Attach the selected photos in the chat."]}
      mobileAction={<ActionLink href="#sell-fullName" fullWidth>Start vehicle details</ActionLink>}
    >
      <SellCarForm />
    </FormShell>
  );
}
