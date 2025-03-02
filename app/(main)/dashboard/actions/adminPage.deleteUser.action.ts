"use server";

import { authOptions } from "@/config/authOptions";
import AWS from "aws-sdk";
import { getServerSession } from "next-auth";

export async function deleteUser(username: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "Admins") {
    throw new Error("Unauthorized");
  }

  const cognito = new AWS.CognitoIdentityServiceProvider();

  try {
    await cognito
      .adminDeleteUser({
        UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string,
        Username: username,
      })
      .promise();
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function disableUser(username: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "Admins") {
    throw new Error("Unauthorized");
  }

  const cognito = new AWS.CognitoIdentityServiceProvider();

  try {
    await cognito
      .adminDisableUser({
        UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string,
        Username: username,
      })
      .promise();
    return { success: true };
  } catch (error) {
    console.error("Error disabling user:", error);
    throw error;
  }
}