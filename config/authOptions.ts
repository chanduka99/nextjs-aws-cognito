import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cognito } from "./awsConfig";
import { jwtDecode } from "jwt-decode";
import { SignInError } from "@/constants/errorMessages";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      error?: string | null;
    };
    accessToken?: unknown;
    idToken?: unknown;
  }
}


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
          console.log("response", response);
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
          return user;
        } catch (error:any) {
          // let returnObj;
          switch(error.code){
            case "NotAuthorizedException":
              throw new Error(SignInError.INVALID_CREDENTIALS);
              // returnObj = {error: SignInError.INVALID_CREDENTIALS};
              // break;
            case "UserNotFoundException":
              throw new Error(SignInError.USER_NOT_FOUND);
              // returnObj = {error: SignInError.USER_NOT_FOUND};
              // break;
            case "UserNotConfirmedException":
              throw new Error(SignInError.USER_NOT_CONFIRMED);
              // returnObj = {error: SignInError.USER_NOT_CONFIRMED};
              // break;
             default:
              throw new Error("An error occurred");
              // returnObj = {error: "An error occurred"};
              // break;
          }
          return null;
          // "authOptions authorize function:", error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
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

      return session;
    },
  //   async signIn(user) {  
  //     switch ((user as any)?.error) {
  //       case SignInError.INVALID_CREDENTIALS:
  //         throw new Error(SignInError.INVALID_CREDENTIALS);
  //       case SignInError.USER_NOT_FOUND:
  //         throw new Error(SignInError.USER_NOT_FOUND);
  //       case SignInError.USER_NOT_CONFIRMED:
  //         throw new Error(SignInError.USER_NOT_CONFIRMED);
  //       case "An error occurred":
  //         throw new Error("An error occurred");    
  //   }
  //   return false;
  // },
}};
