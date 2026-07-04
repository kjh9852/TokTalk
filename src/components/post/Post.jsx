import { usePosts } from "@/context/PostContext.jsx";

import Board from "@/canvas/Board.jsx";

import PostList from "./PostList/PostList.jsx";

export default function Post() {
  const { postList, handleNextPage, handlePrevPage } = usePosts();

  return (
    <>
      <PostList postList={postList} />
      <Board onPostNext={handleNextPage} onPostPrev={handlePrevPage} />
    </>
  );
}
