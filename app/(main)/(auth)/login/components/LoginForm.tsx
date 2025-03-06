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
import { handleSignIn } from "../actions/loginFormActions";
import SubmitButton from "./SubmitButton";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useState } from "react";
import { EyeIcon } from "lucide-react";
import { EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    let redirectPath = "/login";
    handleSignIn(formData).then((response) => {
      console.log("response in form", response);
      if (response.status === "error") {
        toast.error(response.message)
        setIsLoading(false);
      }
      if (response.status === "success") {
        redirectPath = "/dashboard"
      } 
    }).catch((error) => 
      {
        toast.error("Something went wrong");
        redirectPath = "/login" }).finally(() => {
        redirect(redirectPath)
    });
  };
  return (
    <div className="w-full max-w-md space-y-8 p-8 rounded-lg border shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="m@example.com" required />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

{!isLoading && (        <Button type="submit" className="w-full" disabled={isLoading}>
          Login
        </Button>)}
        {isLoading && (        <div className="flex justify-center items-center">
                  <Spinner size="medium" />
                </div>)}
      </form>
    </div>
  );
}
