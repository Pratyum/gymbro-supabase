import {
    createOrganization,
    deleteOrganization,
    getOrganization,
    updateOrganization
} from '@/actions/organizations';
import { getUser } from '@/actions/user';
import { InsertOrganization } from '@/utils/db/schema';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const {dbUser} = await getUser();
        if(!dbUser.organizationId){
            return NextResponse.json({ success: false, error: 'User is not part of an organization' }, { status: 400 });
        }
        const { data, success } = await getOrganization(dbUser.organizationId);
        return NextResponse.json({ success: success, organizations: data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'GET error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json() as InsertOrganization & { adminPhoneNumber : string};
        const organization = await createOrganization(data, data.adminPhoneNumber);
        return NextResponse.json({ success: true, organization }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'POST error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const data = await req.json() as Partial<InsertOrganization> & { id: number };
        const organization = await updateOrganization(data.id, data);
        return NextResponse.json({ success: true, organization });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'PATCH error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        await deleteOrganization(data.id);
        return NextResponse.json({ success: true, message: 'Organization deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'DELETE error' }, { status: 500 });
    }
}