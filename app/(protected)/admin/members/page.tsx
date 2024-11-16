import { members } from "@/components/constants/memberships";
import { MembershipPage } from "@/components/membership-page";

export default function MembershipsPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Members</h1>
            <MembershipPage members={members} />
        </div>
    );
}
