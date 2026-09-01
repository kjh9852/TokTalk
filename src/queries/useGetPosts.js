import { useQuery } from "@tanstack/react-query";

import { getPost } from "@/api/post/post";

export function useGetPosts(page, pageDocsRef) {
  return useQuery({
    queryFn: () => {
      const startDoc = pageDocsRef.current[page - 1] ?? null;

      return getPost({ pageSize: 6, startDoc, page });
    },
    queryKey: ["posts", page],
    staleTime: 1000 * 60,
  });
}
