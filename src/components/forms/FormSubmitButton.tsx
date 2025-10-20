// components/SubmitButton.jsx
"use client"; // Mark as a Client Component

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

export function FormSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className="bg-red-700 text-white py-2 px-4 rounded-md w-max self-center"
    >
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}
