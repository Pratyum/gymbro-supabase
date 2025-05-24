import { getAllTrainersForOrganization } from "@/actions/organizations";
import { getUser } from "@/actions/user";
import TrainerPage from "@/components/trainer/trainer-page";
import { notFound } from "next/navigation";

export default async function TrainersPage() {
    try{
        const {dbUser} = await getUser();
        if(!dbUser || !dbUser.organizationId){
            return notFound();
        }
        const {success, data: trainers} = await getAllTrainersForOrganization(dbUser.organizationId);
        if(!success || !trainers){
            return notFound();
        }
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Trainers</h1>
                <TrainerPage trainers={trainers} />
            </div>
        );
    } catch(error){
        console.error("Error loading trainers page:", error instanceof Error ? error.message : error);
        return notFound();
    }
}
