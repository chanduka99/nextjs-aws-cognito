"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <div>
      {pending ? (
        <div>Loading....</div>
      ) : (
        <Button type="submit" className="w-full">
          Login
        </Button>
      )}
    </div>
  );
}
