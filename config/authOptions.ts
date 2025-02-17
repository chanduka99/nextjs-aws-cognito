import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AWS from "aws-sdk";
import { jwtDecode } from "jwt-decode";

declare module "next-auth" {
  interface Session {
    accessToken?: unknown;
    idToken?: unknown;
  }
}

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.COGNITO_REGION,
});

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTHT_SECRET as string,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },

      async authorize(credentials) {
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

          console.log("auth RESULTS:", response.AuthenticationResult);

          let decodedIdToken;
          if (response.AuthenticationResult?.IdToken) {
            decodedIdToken = jwtDecode(
              response.AuthenticationResult.IdToken as string
            ) as {
              email?: string;
              sub?: string;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              [key: string]: any;
            };
          }

          console.log("decodedIdToken:", decodedIdToken);

          const user = {
            id: response.ChallengeParameters?.USER_ID_FOR_SRP as string, // User ID for Secure Remote Password
            name: credentials.username,
            email: decodedIdToken?.email,
            accessToken: response.AuthenticationResult?.AccessToken,
            idToken: response.AuthenticationResult?.IdToken,
          };
          console.log("user object:", user);
          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, trigger, user }) {
      console.log("jwt callback:", {
        token,
        account,
        profile,
        trigger,
      });
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.accessToken = (token.user as any).accessToken;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.idToken = (token.user as any).idToken;
      console.log("session callback:", {
        session,
      });
      return session;
    },
  },
};
