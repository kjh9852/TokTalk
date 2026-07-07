import { useInfiniteQuery } from "@tanstack/react-query";

import { getPost } from "@/api/post/post";

export function useManagementPosts() {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => getPost({ pageSize: 6, startDoc: pageParam }),

    queryKey: ["posts"],

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      return lastPage.lastDoc ?? undefined;
    },
  });
}
