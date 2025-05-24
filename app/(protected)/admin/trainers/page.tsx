import { getAllTrainersForOrganization } from "@/actions/organizations";
import { getUser } from "@/actions/user";
import TrainerPage from "@/components/trainer/trainer-page";
import { notFound } from "next/navigation";

export default async function TrainersPage() {
    const {dbUser} = await getUser();
    if(!dbUser || !dbUser.organizationId){
        return notFound();
    }
    const {success, data: trainers} = await getAllTrainersForOrganization(dbUser.organizationId);
    if(!success || !trainers || trainers.length === 0){
        return notFound();
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Trainers</h1>
            <TrainerPage trainers={trainers} />
        </div>
    );
}
