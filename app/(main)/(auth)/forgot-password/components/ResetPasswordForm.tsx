"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleResetPassword } from "../actions/resetPasswordFormActions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter} from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export function ResetPasswordForm({
  className,
  email,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidToSubmit, setIsValidToSubmit] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await handleResetPassword(formData);
      toast.success("Password reset successfully");
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (password !== confirmPassword) {
      setError("passwords do not match");
      setIsValidToSubmit(false);
    }else{
      setError("");
      setIsValidToSubmit(true);
    }
  }, [password, confirmPassword]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter the code from your email and your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <Input
                type="hidden"
                name="email"
                value={email}
              />
              <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  name="code"
                  placeholder="Enter code from email"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  required
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="grid gap-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  name="confirm-password"
                  placeholder="Confirm new password"
                  required
                  disabled={isLoading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {!isLoading && (<Button type="submit" disabled={isLoading || !isValidToSubmit}>
                Reset Password
              </Button>)}
              {isLoading && (<div className="flex justify-center items-center">
          <Spinner size="medium" />
        </div>)}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 