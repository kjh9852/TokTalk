import DeleteIcon from "@/assets/icons/close.png";
import { usePosts } from "@/context/PostContext";

import Pagination from "./Pagination";
import styles from "./PostEditList.module.css";

export default function PostEditList() {
  const {
    isLoading,
    postList,
    page,
    totalPage,
    handleDeletePost,
    handlePageChange,
  } = usePosts();

  if (isLoading) {
    return (
      <div>
        <p style={{ color: "#222" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {postList.map((post) => (
        <div className={styles.list}>
          <div className={styles.card}>
            <p className={styles.text}>{post.content}</p>
            <p className={styles.text}>{`작성자 : ${post.userName}`}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePost(post.id);
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
