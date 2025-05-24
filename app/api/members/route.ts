import { getAllMembersForOrganization } from "@/actions/organizations";
import { getUser } from "@/actions/user";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try{
        const {dbUser} = await getUser();
        if(!dbUser) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        if(!dbUser.organizationId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        if (!dbUser.organizationId && !(dbUser.role === "admin")) {
            return NextResponse.json(
                { success: false, message: "You don't have permission to invite users" },
                { status: 403 }
            );
        }
        const result = await getAllMembersForOrganization(dbUser.organizationId);
        return NextResponse.json(result);
    }catch (error) {
        console.error("Error fetching members:", error instanceof Error ? error.message : error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}