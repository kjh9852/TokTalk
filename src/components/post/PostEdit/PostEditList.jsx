import { useEffect, useRef } from "react";

import deleteIcon from "@/assets/icons/close.png";
import { useDeletePost } from "@/queries/useDeletePost";
import { useManagementPosts } from "@/queries/useManagementPosts";

import styles from "./PostEditList.module.css";

export default function PostEditList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useManagementPosts();
  const { mutate: deletePost } = useDeletePost();
  const observerRef = useRef(null);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  const handleDeletePost = (e, postId) => {
    e.stopPropagation();
    deletePost(postId);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "0px 0px -100px 0px",
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage]);

  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <div key={post.id} className={styles.list}>
          <div className={styles.card}>
            <p className={styles.text}>{post.content}</p>
            <p className={styles.text}>{`작성자 : ${post.userName}`}</p>
          </div>
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              handleDeletePost(e, post.id);
            }}
          >
            <img className={styles.buttonImage} src={deleteIcon} alt="삭제" />
          </button>
        </div>
      ))}
      {hasNextPage && (
        <div ref={observerRef} style={{ height: "25px" }}>
          {isFetchingNextPage && <p style={{ color: "#222" }}>Loading...</p>}
        </div>
      )}
    </div>
  );
}
