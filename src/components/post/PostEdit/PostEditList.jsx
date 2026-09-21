import { useEffect, useRef } from "react";

import { useDeletePost } from "@/queries/useDeletePost";
import { useManagementPosts } from "@/queries/useManagementPosts";

import { Loading } from "@/components/ui";

import styles from "./PostEditList.module.css";

export default function PostEditList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useManagementPosts();
  const { mutate: deletePost, isPending } = useDeletePost();
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
        rootMargin: "0px 0px 200px 0px",
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {isPending && (
        <div className={styles.deleteOverlay}>
          <p>삭제 중...</p>
          <Loading />
        </div>
      )}

      <div className={styles.container}>
        {posts.map((post) => (
          <div key={post.id} className={styles.list}>
            <div className={styles.card}>
              <p className={styles.text}>{post.content}</p>
              <p className={styles.author}>{`작성자 : ${post.userName}`}</p>
            </div>
            <button
              className={`${styles.deleteButton}`}
              disabled={isPending}
              onClick={(e) => {
                handleDeletePost(e, post.id);
              }}
            >
              <svg
                className={styles.deleteIcon}
                viewBox="0 0 14 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.33333 4H1.55556V14.4C1.55556 14.8243 1.71944 15.2313 2.01117 15.5314C2.30289 15.8314 2.69855 16 3.11111 16H10.8889C11.3014 16 11.6971 15.8314 11.9888 15.5314C12.2806 15.2313 12.4444 14.8243 12.4444 14.4V4H2.33333ZM5.44444 13.6H3.88889V6.4H5.44444V13.6ZM10.1111 13.6H8.55556V6.4H10.1111V13.6ZM10.5918 1.6L9.33333 0H4.66667L3.40822 1.6H0V3.2H14V1.6H10.5918Z"
                  fill="#555555"
                />
              </svg>
            </button>
          </div>
        ))}
        {hasNextPage && (
          <div ref={observerRef} style={{ height: "50px" }}>
            {isFetchingNextPage && <Loading />}
          </div>
        )}
      </div>
    </>
  );
}
