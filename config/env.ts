import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // AWS_COGNITO_USER_POOL_ID: z.string().min(1),
    // AWS_COGNITO_IDENTITY_POOL_ID: z.string().min(1),
    // // AWS_COGNITO_CLIENT_ID: z.string().min(1),
    // AWS_COGNITO_CLIENT_SECRET: z.string().min(1),
    // AWS_COGNITO_ISSUER: z.string().min(1).url(),
    // NEXTAUTHT_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID: z.string().min(1),
    NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID:
      process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
    NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID:
      process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
    // AWS_COGNITO_IDENTITY_POOL_ID: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
    // AWS_COGNITO_CLIENT_SECRET: process.env.AWS_COGNITO_CLIENT_SECRET,
    // AWS_COGNITO_ISSUER: process.env.AWS_COGNITO_ISSUER,
    // NEXTAUTHT_SECRET: process.env.NEXTAUTHT_SECRET,
  },
});
