import { useEffect, useState } from "react";

import { useGetPosts } from "@/queries/useGetPosts.js";
import { useTotalPage } from "@/queries/useTotalPage.js";

import Board from "@/canvas/Board.jsx";

import PostList from "@/components/post/PostList/PostList";
import LoadingSpinner from "@/components/ui/Loading/LoadingSpinner";

export default function Post() {
  const [pageDocs, setPageDocs] = useState([null]);
  const [page, setPage] = useState(1);
  const { data, isPending } = useGetPosts(page, pageDocs);
  const { data: totalPage } = useTotalPage();
  const posts = data?.posts ?? [];

  const handleNextPage = () => {
    if (page >= totalPage) return;
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page <= 1) return;
    setPage((prev) => prev - 1);
  };

  useEffect(() => {
    if (!data?.lastDoc) return;
    setPageDocs((prev) => {
      const newArr = [...prev];
      newArr[page] = data.lastDoc;
      return newArr;
    });
  }, [data]);

  return (
    <>
      <PostList postList={posts} />
      {isPending && <LoadingSpinner />}
      <Board onPostNext={handleNextPage} onPostPrev={handlePrevPage} />
    </>
  );
}
