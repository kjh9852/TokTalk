import { useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { getPost } from "@/api/post/post";

const PAGE_SIZE = 6;
const STALE_TIME = 1000 * 60;

export function usePrefetchPosts(pageDocsRef, totalPage) {
  const queryClient = useQueryClient();

  const prefetchPosts = useCallback(
    async (startPage, count = 2) => {
      let startDoc = pageDocsRef.current[startPage - 1] ?? null;

      for (let i = 0; i < count; i++) {
        const nextPage = startPage + i;

        if (nextPage > totalPage) break;

        const result = await queryClient.fetchQuery({
          queryKey: ["posts", nextPage],
          queryFn: () => getPost({ pageSize: PAGE_SIZE, startDoc }),
          staleTime: STALE_TIME,
        });

        if (!result?.lastDoc) break;

        pageDocsRef.current[nextPage] = result.lastDoc;
        startDoc = result.lastDoc;
      }
    },
    [queryClient, totalPage, pageDocsRef],
  );

  return { prefetchPosts };
}
