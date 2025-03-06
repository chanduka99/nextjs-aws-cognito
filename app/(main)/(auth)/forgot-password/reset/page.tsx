
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { redirect } from "next/navigation";
import { z } from "zod";
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
} ) {
  const queryParams = await searchParams;
  const email = queryParams.email;

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const validatedFields = forgotPasswordSchema.safeParse({
  email: email,
});
if(!email){
  redirect("/forgot-password");
}
if (!validatedFields.success) {
  redirect("/forgot-password");
}
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <ResetPasswordForm className="w-full max-w-[400px]" email={email} />
    </div>
  );
} 