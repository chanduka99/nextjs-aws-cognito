"use server";
import AWS from "aws-sdk";

import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["Admin", "Standard User"], {
    required_error: "Please select a role",
    invalid_type_error: "Invalid role selected",
  }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function submitForm(prevState: any, formData: FormData) {
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
  } catch (error) {
    console.error(error);
  }

  // Here you would typically handle the successful form submission,
  // like creating a user session or storing data
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
  cognito.adminSetUserPassword(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
  return;
}

async function createNewUser(
  cognito: AWS.AWS.CognitoIdentityServiceProvider,
  userData: { email: string; password: string; role: string }
) {
  const params: AWS.CognitoIdentityServiceProvider.AdminCreateUserRequest = {
    DesiredDeliveryMediums: ["EMAIL"],
    MessageAction: "RESEND",
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
  const newUser = cognito.adminCreateUser(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
  return newUser;
}
