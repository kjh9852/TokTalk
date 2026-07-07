import { useEffect, useState } from "react";

import DeleteIcon from "@/assets/icons/close.png";
import { useDeletePost } from "@/queries/useDeletePost";
import { useGetPosts } from "@/queries/useGetPosts";
import { useTotalPage } from "@/queries/useTotalPage";

import Pagination from "./Pagination";
import styles from "./PostEditList.module.css";

export default function PostEditList() {
  const [pageDocs, setPageDocs] = useState([null]);
  const [page, setPage] = useState(1);
  const { data: totalPage } = useTotalPage();
  const { data, isFetching } = useGetPosts(page, pageDocs);
  const { mutate: deletePost } = useDeletePost();

  const posts = data?.posts ?? [];

  const handleDeletePost = (e, postId) => {
    e.stopPropagation();
    deletePost(postId);
  };

  const handlePageChange = (newPage) => {
    if (!pageDocs[newPage - 1] && newPage !== 1) {
      return;
    }

    setPage(newPage);
  };

  useEffect(() => {
    if (!data?.lastDoc) return;
    setPageDocs((prev) => {
      const newArr = [...prev];
      newArr[page] = data.lastDoc;
      return newArr;
    });
  }, [data]);

  if (isFetching) {
    return (
      <div>
        <p style={{ color: "#222" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <div key={post.id} className={styles.list}>
          <div className={styles.card}>
            <p className={styles.text}>{post.content}</p>
            <p className={styles.text}>{`작성자 : ${post.userName}`}</p>
          </div>
          <button
            onClick={(e) => {
              handleDeletePost(e, post.id);
            }}
            className={styles.deleteButton}
          >
            <img className={styles.buttonImage} src={DeleteIcon} alt="삭제" />
          </button>
        </div>
      ))}
      <Pagination
        currentPage={page}
        totalPage={totalPage}
        onPageClick={handlePageChange}
      />
    </div>
  );
}
