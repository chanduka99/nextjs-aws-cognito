"use server";

import { cognito } from "@/config/awsConfig";
import { z } from "zod";

export async function handleResetPassword(formData: FormData) {
    const code = formData.get("code") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
  
    if (!code || !password || !email) {
      throw new Error("Please provide all required fields");
    }
  
  
    try {
      const params = {
        ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID as string,
        ConfirmationCode: code,
        Password: password,
        Username: email,
      };
  
      const response = await cognito.confirmForgotPassword(params).promise();
      console.log("reset password response:",response);
      return { success: true };
    } catch (error:any) {
      console.error("Reset password error:", error);
      if(error.code === "ExpiredCodeException"){
        throw new Error("Code expired");
      }
      if(error.code === "CodeMismatchException"){
        throw new Error("Invalid code");
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to reset password");
    }
  } 