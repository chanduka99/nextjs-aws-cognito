"use client";

import { useRef, useTransition } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { submitForm } from "../actions/createUserModal.action";
import { RoleType } from "@/constants/roleTypes";
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Submit"
      )}
    </Button>
  );
}

export default function CreateUserModal() {
  const [state, formAction] = useActionState(submitForm, null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      startTransition(() => {
        formAction(new FormData());
        if (formRef.current) {
          formRef.current.reset();
        }
      });
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Create New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
            {state?.error?.email && (
              <p className="text-sm text-red-500">{state.error.email[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            {state?.error?.password && (
              <p className="text-sm text-red-500">{state.error.password[0]}</p>
            )}
          </div>
          <div className="space-y-2 pb-5">
            <Label htmlFor="role">Role</Label>
            <Select name="role" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent defaultValue={RoleType.STANDARD_USER}>
                <SelectItem value={RoleType.ADMIN}>{RoleType.ADMIN}</SelectItem>
                <SelectItem value={RoleType.STANDARD_USER}>
                  {RoleType.STANDARD_USER}
                </SelectItem>
              </SelectContent>
            </Select>
            {state?.error?.role && (
              <p className="text-sm text-red-500">{state.error.role[0]}</p>
            )}
          </div>
          <SubmitButton />
        </form>
        {state?.success && (
          <p className="text-sm text-green-500 mt-2">
            Form submitted successfully!
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
