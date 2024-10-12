import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'
import ProviderSigninBlock from "@/components/ProviderSigninBlock"
import VerifyForm from "@/components/VerifyForm"

export default function Verify() {
    return (
        <div className="flex items-center justify-center bg-muted min-h-screen">

            <Card className="w-[350px] mx-auto">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center py-4">
                        <Link href='/'>
                            <Image src="/logo.png" alt="logo" width={50} height={50} />
                        </Link>
                    </div>

                    <CardTitle className="text-2x\l font-bold">Verify</CardTitle>
                    <CardDescription>Verify your account!</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <VerifyForm />
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                    <ProviderSigninBlock />
                </CardContent>
                <CardFooter className="flex-col text-center">
                    <Link className="w-full text-sm text-muted-foreground" href="/login">
                        Have an account? Login
                    </Link>
                </CardFooter>
            </Card>
        </div >

    )
}