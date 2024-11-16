import { db } from '@/utils/db/db';
import { usersTable } from '@/utils/db/schema';
import { eq } from "drizzle-orm";
export async function POST(request: Request) {
    try {
        const response = await request.json()
        // On subscribe, write to db
        await db.update(usersTable).set({ plan: response.data.object.id }).where(eq(usersTable.stripe_id, response.data.object.customer));
        // Process the webhook payload
    } catch (error: any) {
        return new Response(`Webhook error: ${error.message}`, {
            status: 400,
        })
    }
    return new Response('Success', { status: 200 })
}