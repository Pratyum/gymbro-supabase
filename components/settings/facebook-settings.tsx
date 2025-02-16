"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Facebook } from "lucide-react";

const FacebookSettings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [integration, setIntegration] = useState<any>(null);

    const handleFacebookLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            // Initialize Facebook SDK
            const response = await fetch("/api/auth/facebook/url");
            const { url } = await response.json();
            window.location.href = url;
        } catch (err) {
            setError("Failed to initialize Facebook login");
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm("Are you sure you want to disconnect Facebook integration?"))
            return;

        try {
            await fetch("/api/integrations/facebook", {
                method: "DELETE",
            });
            setIntegration(null);
        } catch (err) {
            setError("Failed to disconnect Facebook integration");
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Facebook className="w-6 h-6" />
          Facebook Integration
                </CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {integration ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">Connected Page</p>
                                <p className="text-sm text-gray-600">{integration.pageName}</p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={handleDisconnect}
                                disabled={loading}
                            >
                Disconnect
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="mb-4 text-gray-600">
              Connect your Facebook page to automatically import leads from
              Facebook Lead Ads.
                        </p>
                        <Button
                            size="lg"
                            onClick={handleFacebookLogin}
                            disabled={loading}
                            className="gap-2"
                        >
                            <Facebook className="w-4 h-4" />
              Connect Facebook Page
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FacebookSettings;
