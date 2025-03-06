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
import { handleForgotPassword } from "../actions/forgotPasswordFormActions";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();
  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await handleForgotPassword(formData);
      if(response.success){
        setIsEmailSent(true);
        toast.success("Password reset instructions sent to your email");
        router.push(`${window.location.pathname}/reset?email=${formData.get("email")}`);
      }
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you instructions to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading || isEmailSent}
                />
              </div>
            { !isLoading && (<Button type="submit" disabled={isLoading || isEmailSent}>
                Send Reset Instructions
              </Button>)}
              {isLoading && (<div className="flex justify-center items-center">
          <Spinner size="medium" />
            </div>)}
              {isEmailSent && (
                <p className="text-sm text-green-600">
                  Check your email for the reset instructions
                </p>
              )}
              <div className="text-center text-sm">
                <Link
                  href="/login"
                  className="text-primary hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 