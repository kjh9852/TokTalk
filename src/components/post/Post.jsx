import { useEffect, useState } from "react";

import { useGetPosts } from "@/queries/useGetPosts.js";
import { useTotalPage } from "@/queries/useTotalPage.js";
import { Text } from "@react-three/drei";

import { useNewPostNotification } from "@/hooks/useNewPostNotification";

import Board from "@/canvas/world/Board.jsx";

import PostList from "@/components/post/PostList/PostList";
import LoadingSpinner from "@/components/ui/Loading/LoadingSpinner";

export default function Post() {
  const [pageDocs, setPageDocs] = useState([null]);
  const [page, setPage] = useState(1);
  const { data, isPending, isFetching } = useGetPosts(page, pageDocs);
  const { data: totalPage } = useTotalPage();
  const [initialLastestDate, setInitialLastestDate] = useState(null);

  const posts = data?.posts ?? [];

  const lastestPost = useNewPostNotification();

  const hasNewPost =
    lastestPost &&
    initialLastestDate &&
    lastestPost?.createDate > initialLastestDate;

  useEffect(() => {
    if (page === 1 && posts.length > 0) {
      setInitialLastestDate(posts[0].createDate);
    }
  }, [posts, page]);

  const handleNextPage = () => {
    if (page >= totalPage || isFetching) return;
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page <= 1 || isFetching) return;
    setPage((prev) => prev - 1);
  };

  useEffect(() => {
    if (!data?.lastDoc) return;
    setPageDocs((prev) => {
      const newArr = [...prev];
      newArr[page] = data.lastDoc;
      return newArr;
    });
  }, [data?.lastDoc]);

  return (
    <>
      <PostList postList={posts} />
      {isPending && <LoadingSpinner />}
      {page !== 1 && hasNewPost && (
        <group position={[8, 3.8, 3.8]}>
          <Text fontSize={0.2} rotation={[0, -Math.PI, 0]}>
            새 게시글이 있습니다
          </Text>
        </group>
      )}
      <Board onPostNext={handleNextPage} onPostPrev={handlePrevPage} />
    </>
  );
}
