import { db } from "@/utils/db/db";
import {
  InsertOrganization,
  organizations,
  usersTable,
} from "@/utils/db/schema";
import { createStripeCustomer } from "@/utils/stripe/api";
import { createClient } from "@/utils/supabase/server";
import { and, eq } from "drizzle-orm";

export const createOrganization = async (
  payload: Omit<InsertOrganization, "adminUserId" | "id">,
  adminPhoneNumber: string,
) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    phone: adminPhoneNumber,
    password: "example-password",
    options: { channel: "sms" },
  });
  if (error) {
    return { success: false, error: error.message };
  }
  const stripeId = await createStripeCustomer(
    data?.user?.id!,
    adminPhoneNumber,
  );
  const rows = await db
    .insert(usersTable)
    .values({
      name: "new-admin",
      phoneNumber: adminPhoneNumber,
      stripe_id: stripeId,
      plan: "none",
    })
    .returning({ id: usersTable.id });
  if (rows.length === 0) {
    return { success: false, error: "Failed to create organization" };
  }
  const userId = rows[0].id;
  const organization = await db
    .insert(organizations)
    .values({
      ...payload,
      adminUserId: userId,
    })
    .returning();
  if (organization.length === 0) {
    return { success: false, error: "Failed to create organization" };
  }

  return { success: true, data: organization[0] };
};

export const updateOrganization = async (
  id: number,
  payload: Partial<InsertOrganization>,
) => {
  await db.update(organizations).set(payload).where(eq(organizations.id, id));
  return { success: true };
};

export const deleteOrganization = async (id: number) => {
  await db.delete(organizations).where(eq(organizations.id, id));
  return { success: true };
};

// Memberships
export const getAllMembersForOrganization = async (organizationId: number) => {
  const members = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.organizationId, organizationId));
  return { success: true, data: members };
};

export const createMember = async (
  organizationId: number,
  phoneNumber: string,
) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    phone: phoneNumber,
    password: "example-password",
    options: { channel: "sms" },
  });
  if (error) {
    return { success: false, error: error.message };
  }
  const stripeId = await createStripeCustomer(data?.user?.id!, phoneNumber);
  await db.insert(usersTable).values({
    name: "",
    phoneNumber,
    stripe_id: stripeId,
    organizationId,
    plan: "none",
  });
  return { success: true };
};

export const createMembersBatch = async (
  csvFile: File,
  organizationId: number,
) => {
  const supabase = await createClient();
  // Parse the csv file
  const text = await csvFile.text();
  const phoneNumbers = text.split("\n");
  const rowsToInsert = [];
  const errors = [];
  for (const phoneNumber of phoneNumbers) {
    const { data, error } = await supabase.auth.signUp({
      phone: phoneNumber,
      password: "example-password",
      options: { channel: "sms" },
    });
    if (error) {
      errors.push({ phoneNumber, error: error.message });
      continue;
    }
    const stripeId = await createStripeCustomer(data?.user?.id!, phoneNumber);
    rowsToInsert.push({
      name: "",
      phoneNumber,
      stripe_id: stripeId,
      organizationId,
      plan: "none",
    });
  }

  await db.insert(usersTable).values(rowsToInsert);
  return { success: true, errorRows: errors };
};

// Admins

export const getAllAdminsForOrganization = async (organizationId: number) => {
  const admins = await db
    .select()
    .from(usersTable)
    .where(
      and(
        eq(usersTable.organizationId, organizationId),
        eq(usersTable.role, "admin"),
      ),
    );
  return { success: true, data: admins };
};

export const createAdmin = async (
  organizationId: number,
  phoneNumber: string,
) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    phone: phoneNumber,
    password: "example-password",
    options: { channel: "sms" },
  });
  if (error) {
    return { success: false, error: error.message };
  }
  const stripeId = await createStripeCustomer(data?.user?.id!, phoneNumber);
  await db.insert(usersTable).values({
    name: "",
    phoneNumber,
    stripe_id: stripeId,
    organizationId,
    plan: "admin",
  });
  return { success: true };
};
