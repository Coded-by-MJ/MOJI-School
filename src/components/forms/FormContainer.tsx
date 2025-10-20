"use client";

import { useEffect, useActionState } from "react";
import { toast } from "sonner";
import { ActionState } from "@/types/index";

const initialState: ActionState = {
  message: "",
  type: "error",
};

function FormContainer({
  action,
  children,
  className,
}: {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className: string | undefined;
}) {
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state.message) {
      toast[state.type](state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  );
}

export default FormContainer;
