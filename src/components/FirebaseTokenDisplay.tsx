// TODO: Remove this component for production.

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { CopyIcon, CheckIcon } from "lucide-react";
import { getCurrentUserToken } from "@/lib/firebase-init";

export function FirebaseTokenDisplay() {
  const { currentUser } = useAuth();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [uidCopied, setUidCopied] = useState<boolean>(false);

  const fetchToken = async () => {
    try {
      setLoading(true);
      const idToken = await getCurrentUserToken();
      setToken(idToken);
    } catch (error) {
      console.error("Error fetching token:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyUidToClipboard = () => {
    if (currentUser?.uid) {
      navigator.clipboard.writeText(currentUser.uid);
      setUidCopied(true);
      setTimeout(() => setUidCopied(false), 2000);
    }
  };

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ID Token</CardTitle>
          <CardDescription>You need to be logged in to view your ID token.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ID Token</CardTitle>
        <CardDescription>
          This is your authentication ID token. It can be used for authenticated API requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">User ID (UID)</h3>
            <div className="flex items-center space-x-2">
              <Textarea
                readOnly
                value={currentUser.uid}
                className="h-10 font-mono text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyUidToClipboard}
                className="flex items-center gap-1 whitespace-nowrap"
              >
                {uidCopied ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {token ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">ID Token</h3>
              <Textarea
                readOnly
                value={token}
                className="h-32 font-mono text-xs"
              />
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <p>Click the button below to fetch your ID token.</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={fetchToken} disabled={loading}>
          {loading ? "Loading..." : "Get ID Token"}
        </Button>
      </CardFooter>
    </Card>
  );
}