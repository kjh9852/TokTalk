import { useInfiniteQuery } from "@tanstack/react-query";

import { getPost } from "@/api/post/post";

export function useManagementPosts() {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => getPost({ pageSize: 6, startDoc: pageParam }),

    queryKey: ["posts"],

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      if (!lastPage.posts || lastPage.posts.length < 6) {
        return undefined;
      }
      return lastPage.lastDoc ?? undefined;
    },
  });
}
