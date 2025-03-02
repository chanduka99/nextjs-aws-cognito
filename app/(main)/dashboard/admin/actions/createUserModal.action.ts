"use server";
import { authOptions } from "@/config/authOptions";
import { CognitoGroupType, RoleType } from "@/constants/roleTypes";
import AWS from "aws-sdk";
import { getServerSession } from "next-auth";

import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum([RoleType.ADMIN, RoleType.STANDARD_USER], {
    required_error: "Please select a role",
    invalid_type_error: "Invalid role selected",
  }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitForm(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role == RoleType.STANDARD_USER) {
    return "Only Admins can create new users";
  }
  const validatedFields = formSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  // Simulate API call
  try {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    //create user
    await createNewUser(cognito, validatedFields.data);
    //change FORCE CHANGE PASSWORD state to CONFIRM
    await changeState(cognito, validatedFields.data);
    // add user to appropiate group
    await addUserToGroup(
      cognito,
      validatedFields.data.role,
      validatedFields.data.email
    );
  } catch (error) {
    console.error("submit form error:", error);
  }
  console.log({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    role: validatedFields.data.role,
  });
  return { success: true, data: validatedFields.data };
}

async function changeState(
  cognito: AWS.CognitoIdentityServiceProvider,
  userData: { email: string; password: string; role: string }
) {
  const params: AWS.CognitoIdentityServiceProvider.AdminSetUserPasswordRequest =
    {
      Password: userData.password /* required */,
      UserPoolId: process.env
        .NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string /* required */,
      Username: userData.email /* required */,
      Permanent: true,
    };
  return await cognito
    .adminSetUserPassword(params, function (err, data) {
      if (err) console.log("change state callback error:", err, err.stack);
      // an error occurred
      else console.log(data); // successful response
    })
    .promise();
}

async function createNewUser(
  cognito: AWS.CognitoIdentityServiceProvider,
  userData: { email: string; password: string; role: string }
) {
  const params: AWS.CognitoIdentityServiceProvider.AdminCreateUserRequest = {
    DesiredDeliveryMediums: ["EMAIL"],
    TemporaryPassword: userData.password,
    UserAttributes: [
      {
        Name: "email",
        Value: userData.email,
      },
    ],
    UserPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string,
    Username: userData.email,
  };
  return await cognito.adminCreateUser(params).promise();
}

async function addUserToGroup(
  cognito: AWS.CognitoIdentityServiceProvider,
  role: RoleType,
  username: string
) {
  const params: AWS.CognitoIdentityServiceProvider.AdminAddUserToGroupRequest =
    {
      GroupName:
        role == RoleType.ADMIN
          ? CognitoGroupType.ADMIN
          : CognitoGroupType.STANDARD_USER /* required */,
      UserPoolId: process.env
        .NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID as string /* required */,
      Username: username /* required */,
    };
  return await cognito.adminAddUserToGroup(params).promise();
}
