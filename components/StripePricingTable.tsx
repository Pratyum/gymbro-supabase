"use client";

import Script from "next/script";
import { FC } from "react";

declare global {
  export namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": {
        key: string;
        "pricing-table-id": string;
        "publishable-key": string;
        "client-reference-id"?: string;
      };
    }
  }
}

export const NextStripePricingTable: FC<{
  pricingTableId?: string;
  publishableKey?: string;
  clientReferenceId?: string;
}> = ({ pricingTableId, publishableKey, clientReferenceId }) => {
    if (!pricingTableId || !publishableKey) return null;
    return (
        <>
            <Script
                async
                strategy="lazyOnload"
                src="https://js.stripe.com/v3/pricing-table.js"
            />
            <stripe-pricing-table
                pricing-table-id={pricingTableId}
                publishable-key={publishableKey}
                client-reference-id={clientReferenceId}
            />
        </>
    );
};

export default function StripePricingTable({
    checkoutSessionSecret,
}: {
  checkoutSessionSecret: string;
}) {
    return (
        <NextStripePricingTable
            pricing-table-id={process.env.STRIPE_PRICING_TABLE_ID}
            publishable-key={process.env.STRIPE_PUBLISHABLE_KEY}
            customer-session-client-secret={checkoutSessionSecret}
        ></NextStripePricingTable>
    );
}
