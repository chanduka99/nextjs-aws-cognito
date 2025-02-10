"use client";

import { Amplify, type ResourcesConfig } from "aws-amplify";
import { env } from "./env";

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
    userPoolClientId: env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,
  },
};

Amplify.configure(
  {
    Auth: authConfig,
  },
  { ssr: true } // making sure amplify user cookies for state storage.coz by default amplify use local storage to store state.
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
