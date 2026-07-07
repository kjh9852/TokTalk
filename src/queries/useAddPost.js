import { useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadPost } from "@/api/post/post";

export function useAddPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
}
