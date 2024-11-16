import { db } from "@/utils/db/db";
import { leads } from "@/utils/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Webhook verification schema
const verifySchema = z.object({
  "hub.mode": z.string(),
  "hub.verify_token": z.string(),
  "hub.challenge": z.string(),
});

// Lead entry schema
const leadEntrySchema = z.object({
  field_data: z.array(
    z.object({
      name: z.string(),
      values: z.array(z.string()),
    }),
  ),
  created_time: z.string(),
});

// Webhook payload schema
const webhookSchema = z.object({
  object: z.string(),
  entry: z.array(
    z.object({
      id: z.string(),
      time: z.number(),
      changes: z.array(
        z.object({
          value: z.object({
            form_id: z.string(),
            leadgen_id: z.string(),
            created_time: z.number(),
            page_id: z.string(),
          }),
          field: z.string(),
        }),
      ),
    }),
  ),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const params = Object.fromEntries(searchParams.entries());

    const result = verifySchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 },
      );
    }

    // Verify against your stored token
    if (
      params["hub.verify_token"] !== process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN
    ) {
      return NextResponse.json(
        { error: "Invalid verify token" },
        { status: 403 },
      );
    }

    return new Response(params["hub.challenge"]);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = webhookSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    const { entry } = result.data;

    for (const pageEntry of entry) {
      for (const change of pageEntry.changes) {
        if (change.field === "leadgen") {
          const leadData = await fetchLeadDetails(
            change.value.leadgen_id,
            process.env.FACEBOOK_PAGE_ACCESS_TOKEN!,
          );

          await processLead(leadData, pageEntry.id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function fetchLeadDetails(leadgenId: string, accessToken: string) {
  const response = await fetch(
    `https://graph.facebook.com/v19.0/${leadgenId}?access_token=${accessToken}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch lead details");
  }

  const data = await response.json();
  return leadEntrySchema.parse(data);
}

async function processLead(
  leadData: z.infer<typeof leadEntrySchema>,
  pageId: string,
) {
  // Map Facebook form fields to your lead structure
  const fieldMap = new Map(
    leadData.field_data.map((field) => [field.name, field.values[0]]),
  );

  await db.insert(leads).values({
    source: `facebook_${pageId}`,
    status: "new",
    name: fieldMap.get("full_name") || "",
    email: fieldMap.get("email") || "",
    phone: fieldMap.get("phone_number") || "",
    notes: `Lead from Facebook Page ${pageId}`,
    organizationId: 1, // You'll need to determine the correct organization ID
    createdAt: new Date(leadData.created_time),
    updatedAt: new Date(),
  });
}
