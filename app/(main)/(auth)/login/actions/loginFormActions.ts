"use client";
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

  if (!response?.ok) {
    throw new Error("Failed to authenticate. Please try again shortly");
  }
  return;
}
