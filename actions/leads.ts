import { db } from "@/utils/db/db";
import { InsertLead, leads } from "@/utils/db/schema";
import { eq } from "drizzle-orm";

export const getLeadsForOrganization = async (organizationId: number) => {
  const rows = await db
    .select()
    .from(leads)
    .where(eq(leads.organizationId, organizationId));
  return { success: true, rows };
};

export const createLeadForOrganization = async (payload: InsertLead) => {
  await db.insert(leads).values(payload);
  return { success: true };
};

export const updateLeadForOrganization = async (
  id: number,
  payload: Partial<InsertLead>,
) => {
  await db.update(leads).set(payload).where(eq(leads.id, id));
  return { success: true };
};

export const deleteLeadForOrganization = async (id: number) => {
  await db.delete(leads).where(eq(leads.id, id));
  return { success: true };
};
