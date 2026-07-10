"use client";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "./logout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

class SentryExampleFrontendError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleFrontendError";
  }
}

const Page = () => {
  
  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());
  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => toast.success("AI Job queued"),
    onError: () => {
      toast.error("Something went wrong.");
      throw new SentryExampleFrontendError("This error is raised on the frontend of the example page.");
    }
  }))

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => toast.success("Job queued")
  }));
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected server component
      <div>
      {JSON.stringify(data, null ,2)}
      </div>
      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
        Test AI
      </Button>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Workflow
      </Button>
      <LogoutButton />
    </div>
  );
};

export default Page;