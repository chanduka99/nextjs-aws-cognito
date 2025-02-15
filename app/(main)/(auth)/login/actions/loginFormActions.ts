"use server";
import { redirect } from "next/navigation";
import makeFetchCookie from "fetch-cookie";
// const fetch = require("fetch");
// const fetchUrl = fetch.fetchUrl;
// const cookieJar = new fetch.CookieJar();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleSignIn(prevState: any, formData: FormData) {
  let redirectPath: string | null = null;

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return "Please provide both email and password";
    }

    const response = await nextAuthSignIn({
      apiRoute: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/signin`,
      userName: email,
      password: password,
    });

    if (response === "success") {
      redirectPath = "/dashboard";
    }
  } catch (error) {
    redirectPath = "/";
    console.error(error);
    return "An unexpected error occurred";
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}

async function nextAuthSignIn(options: {
  apiRoute: string;
  userName: string;
  password: string;
}) {
  // const fetchUrl = fetch.fetchUrl;
  // const cookieJar = new fetch.CookieJar();
  const url = options.apiRoute;
  const username = options.userName;
  const password = options.password;
  const fetchCookie = makeFetchCookie(
    fetch,
    new makeFetchCookie.toughCookie.CookieJar()
  );
  const response = await fetchCookie(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: `username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`,
  });

  if (!response?.ok) {
    console.log(response);
    throw new Error("SignIn failed");
  }

  return "success";
}
