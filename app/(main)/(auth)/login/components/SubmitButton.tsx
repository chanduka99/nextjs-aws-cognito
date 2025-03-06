"use client";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/shared/loader";
import { Spinner } from "@/components/ui/spinner";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <div>
      {pending ? (
        <div className="flex justify-center items-center">
          <Spinner size="medium" />
        </div>
      ) : (
        <Button type="submit" className="w-full">
          Login
        </Button>
      )}
    </div>
  );
}
