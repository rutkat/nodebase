import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;

export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

// import { getQueryClient } from "@/trpc/server";
// import { TRPCQueryOptions } from "@trpc/tanstack-react-query";

// export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
//   queryOptions: T,
// ) {
//   const queryClient = getQueryClient();
//   if (queryOptions.queryKey[1]?.type === 'infinite') {
//     void queryClient.prefetchInfiniteQuery(queryOptions as any);
//   } else {
//     void queryClient.prefetchQuery(queryOptions);
//   }
// }