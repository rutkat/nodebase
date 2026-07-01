import { Button } from "@/components/ui/button";
// import { caller } from "@/trpc/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { Suspense } from "react";

const Page = async () => {
  // const users = await caller.getUsers();
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    <div className="min-h-screen
      min-w-screen flex items-center
      justify-center">
      <Button>
      Click me
      </Button>
      <pre>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<p>Loading...</p>}>
            <Client />
          </Suspense>
        </HydrationBoundary>
      </pre>
    </div>
  );
};

export default Page;