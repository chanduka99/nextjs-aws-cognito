import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AWS from "aws-sdk";
import process from "process";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.COGNITO_REGION,
});

export const authOptions: NextAuthOptions = {
  // secret: process.env.NEXTAUTHT_SECRET,
  // pages: {
  //   signIn: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  // },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const cognito = new AWS.CognitoIdentityServiceProvider();

        if (!credentials) return null;

        const params: AWS.CognitoIdentityServiceProvider.InitiateAuthRequest = {
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID as string,
          AuthParameters: {
            USERNAME: credentials.username,
            PASSWORD: credentials.password,
          },
        };

        try {
          const response = await cognito.initiateAuth(params).promise();
          const user = {
            id: response.ChallengeParameters?.USER_ID_FOR_SRP as string, // User ID for Secure Remote Password
            name: credentials.username,
          };
          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
};
