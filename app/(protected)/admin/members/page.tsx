import { getAllMembersForOrganization } from "@/actions/organizations";
import { getUser } from "@/actions/user";
import { MembershipPage } from "@/components/memberships/membership-page";
import { notFound } from "next/navigation";

export default async function MembershipsPage() {
    const {dbUser} = await getUser();
    if(!dbUser || !dbUser.organizationId){
        return notFound();
    }
    const {success, data: members} = await getAllMembersForOrganization(dbUser.organizationId);
    if(!success || !members){
        return notFound();
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Members</h1>
            <MembershipPage members={members} />
        </div>
    );
}
