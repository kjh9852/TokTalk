import { useQuery } from "@tanstack/react-query";

import { getTotalPage } from "@/api/post/post";

export function useTotalPage() {
  return useQuery({
    queryFn: () => getTotalPage(),
    queryKey: ["totalPage"],
  });
}
