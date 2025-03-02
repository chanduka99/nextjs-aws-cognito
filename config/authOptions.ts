import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AWS from "aws-sdk";
import { jwtDecode } from "jwt-decode";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
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
          // console.log("response chanllengeName:", response.ChallengeName);
          // console.log("respone auth results:", response.AuthenticationResult);
          // console.log(
          //   "respone challenge parameters:",
          //   response.ChallengeParameters
          // );
          // console.log("response session:", response.Session);

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

          const user = {
            id: response.ChallengeParameters?.USER_ID_FOR_SRP as string, // User ID for Secure Remote Password
            name: credentials.username,
            email: decodedIdToken?.email,
            role: decodedIdToken?.["cognito:groups"][0],
            accessToken: response.AuthenticationResult?.AccessToken,
            idToken: response.AuthenticationResult?.IdToken,
          };
          // console.log("user object:", user);
          return user;
        } catch (error) {
          console.error("authOptions authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // console.log("jwt callback:", {
      //   token,
      //   account,
      //   profile,
      //   trigger,
      // });
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
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user.role = (token as any).user.role;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.accessToken = (token.user as any).accessToken;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.idToken = (token.user as any).idToken;
      // console.log("session callback:", {
      //   session,
      // });
      return session;
    },
  },
};
