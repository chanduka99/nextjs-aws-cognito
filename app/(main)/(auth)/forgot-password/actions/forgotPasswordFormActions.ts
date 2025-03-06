"use server";

import { cognito } from "@/config/awsConfig";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export async function handleForgotPassword(formData: FormData) {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    throw new Error("Please provide a valid email address");
  }

  

  try {
    const params = {
      ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID as string,
      Username: validatedFields.data.email,
    };

    await cognito.forgotPassword(params).promise();
    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to process forgot password request");
  }
}

