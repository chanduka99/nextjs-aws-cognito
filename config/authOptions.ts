import { NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CognitoProvider({
      clientId: process.env.AWS_COGNITO_CLIENT_ID,
      clientSecret: process.env.AWS_COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
    }),
  ],
};
