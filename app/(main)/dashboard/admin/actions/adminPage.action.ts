"use server";

import { authOptions } from "@/config/authOptions";
import AWS from "aws-sdk";
import { getServerSession } from "next-auth";

export interface CognitoUser {
  UserId: string;
  UserName: string;
  Email: string;
  Status: "ENABLED" | "DISABLED";
  CreatedAt: Date;
  Role: "ADMIN" | "STANDARD_USER";
}

export async function getUsers(): Promise<CognitoUser[]> {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "Admins") {
    throw new Error("Unauthorized");
  }

  const cognito = new AWS.CognitoIdentityServiceProvider();

  try {
    const params = {
      UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string,
    };

    const response = await cognito.listUsers(params).promise();

    console.log("get user actions:", response.Users);
    const users = await Promise.all(
      response.Users?.map(async (user) => {
        if (!user.Username) return null;

        const emailAttribute = user.Attributes?.find(
          (attr) => attr.Name === "email"
        );
        // const emailVerified = user.Attributes?.find(
        //   (attr) => attr.Name === "email_verified"
        // );

        const userGroups = await cognito
          .adminListGroupsForUser({
            UserPoolId: process.env
              .NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string,
            Username: user.Username,
          })
          .promise();

        const role =
          userGroups.Groups?.[0]?.GroupName === "Admins"
            ? "ADMIN"
            : "STANDARD_USER";

        return {
          UserId: user.Username,
          UserName: emailAttribute?.Value,
          Email: emailAttribute?.Value,
          Status: user.Enabled === true ? "ENABLED" : "DISABLED",
          // CreatedAt: Math.floor(
          //   user.UserCreateDate?.getTime() || Date.now() / 1000
          // ),
          CreatedAt: user.UserCreateDate
            ? new Date(user.UserCreateDate).toLocaleString("en-US", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                timeZone: "Asia/Colombo",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : new Date(),
          Role: role,
        };
      }) || []
    );
    return users.filter((user): user is CognitoUser => user !== null);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function enableUser(username: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "Admins") {
    throw new Error("Unauthorized");
  }

  const cognito = new AWS.CognitoIdentityServiceProvider();

  try {
    // First check if user is disabled
    const user = await cognito
      .adminGetUser({
        UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string,
        Username: username,
      })
      .promise();

    if (user.Enabled) {
      throw new Error("User is already enabled");
    }

    await cognito
      .adminEnableUser({
        UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string,
        Username: username,
      })
      .promise();
    return { success: true };
  } catch (error) {
    console.error("Error enabling user:", error);
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
