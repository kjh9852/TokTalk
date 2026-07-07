import { useQuery } from "@tanstack/react-query";

import { getPost } from "@/api/post/post";

export function useGetPosts(page, pageDocs) {
  return useQuery({
    queryFn: () => {
      const startDoc = pageDocs[page - 1] ?? null;

      return getPost({ pageSize: 6, startDoc });
    },
    queryKey: ["posts", page],
  });
}
