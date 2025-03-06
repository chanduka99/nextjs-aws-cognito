"use client";
import { SignInError } from "@/constants/errorMessages";
import { signIn } from "next-auth/react";

export async function handleSignIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Please provide both email and password");
  }

  const username = email;
  const response = await signIn("credentials", {
    username,
    password,
    redirect: false,
  });
console.log("response in form actions", response);
  if (response?.error) {
    return handleSignInError(response.error);
  }
  if (response?.ok) {
    return {status: "success", message: "Success"};
  }
  return { status: "error", message: "Something went wrong" }
}

function handleSignInError(error: string) {
  switch (error) {
    case SignInError.ACCESS_DENIED:
      return { status: "error", message: "Access denied" };
    case SignInError.INVALID_CREDENTIALS:
      return { status: "error", message: "Incorrect username or password" };
    case SignInError.USER_NOT_FOUND:
      return { status: "error", message: "User not found" };
    case SignInError.USER_NOT_CONFIRMED:
      return { status: "error", message: "User not confirmed" };
    default:
      return { status: "error", message: "Something went wrong" };
  }
}

