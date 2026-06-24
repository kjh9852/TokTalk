import { createContext, useContext, useEffect, useState } from "react";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "../api/firebase/firebase";
import {
  deletePost,
  getPage,
  getTotalPage,
  uploadFirebase,
} from "../api/post/post";

const PostContext = createContext(null);
const AdminPostContext = createContext(null);

export default function PostContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [totalPage, setTotalPage] = useState();
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageDocs, setPageDocs] = useState([]);

  const pageSize = 6;

  useEffect(() => {
    const fetchTotalPage = async () => {
      const total = await getTotalPage();
      setTotalPage(total);
    };
    fetchTotalPage();
  }, [postList]);

  useEffect(() => {
    const q = query(collection(db, "post"), orderBy("createDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const startIndex = (page - 1) * pageSize; // 6 , 6 + 6 // 12
      const currentPagePosts = allPosts.slice(
        startIndex,
        startIndex + pageSize,
      );
      // 현재 페이지의 게시물이 사라졌을 경우에만 1페이지로 이동
      if (currentPagePosts.length === 0 && allPosts.length > 0) {
        setPage(1);
      }
    });

    return () => unsubscribe();
  }, [page, pageSize]);

  useEffect(() => {
    const getPosts = async () => {
      const { posts, lastDoc } = await getPage({ pageSize });
      setPostList(posts);
      setPageDocs([null, lastDoc]);
    };
    getPosts();
  }, []);

  const fetchPosts = async (startDoc = null) => {
    const { posts, lastDoc } = await getPage({ pageSize, startDoc });
    return { posts, lastDoc };
  };

  const addPost = async (content, userName) => {
    const tempPost = {
      id: Date.now().toString(),
      content,
      userName,
      createDate: new Date().toISOString(),
    };

    setPostList((prev) => [tempPost, ...prev].slice(0, pageSize));
    console.log(postList);
    try {
      await uploadFirebase(content, userName);
      const total = await getTotalPage();

      const { posts, lastDoc } = await getPage({ pageSize });
      setPostList(posts);
      setPageDocs([null, lastDoc]);
      setPage(1);
      setTotalPage(total);
    } catch (e) {
      setPostList((prev) => prev.filter((p) => p.id !== tempPost.id));
    }
  };

  const handleNextPage = async () => {
    if (page >= totalPage) return;
    console.log(postList.length);
    const currentStart = pageDocs[page];

    const { posts, lastDoc: newLastDoc } = await getPage({
      pageSize,
      startDoc: currentStart,
    });
    setPostList(posts);
    setPageDocs((prev) => {
      const newArr = [...prev];
      newArr[page + 1] = newLastDoc;
      return newArr;
    });
    setPage((p) => p + 1);
  };

  const handlePrevPage = async () => {
    console.log(page);
    if (page <= 1) return;
    const prevStart = pageDocs[page - 2];
    const { posts } = await getPage({
      pageSize,
      startDoc: prevStart,
    });
    setPostList(posts);
    setPage((p) => p - 1);
  };

  const handlePageChange = async (newPage) => {
    const startDoc = pageDocs[newPage - 1] || null;
    const { posts, lastDoc } = await getPage({ pageSize, startDoc });
    setPostList(posts);
    setPageDocs((prev) => {
      const newArr = [...prev];
      newArr[newPage] = lastDoc;
      return newArr;
    });
    setPage(newPage);
  };

  const handleDeletePost = async (id) => {
    setPostList((prev) => prev.filter((post) => post.id !== id));

    try {
      setIsLoading(true);
      await deletePost(id);

      const total = await getTotalPage();
      setTotalPage(total);

      const isLastPostOnPage = postList.length === 1 && page > 1;
      console.log(isLastPostOnPage);

      if (isLastPostOnPage) {
        const { posts, lastDoc } = await getPage({ pageSize });
        setPostList(posts);
        setPageDocs([null, lastDoc]);
        setPage((prev) => prev - 1);
      } else {
        const startDoc = pageDocs?.[page - 1] ?? null;
        const { posts, lastDoc } = await getPage({ pageSize, startDoc });
        setPostList(posts);
        setPageDocs((prev) => {
          const newArr = [...prev];
          newArr[page] = lastDoc;
          return newArr;
        });
      }

      console.log(pageDocs);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PostContext.Provider
      value={{
        fetchPosts,
        isLoading,
        setIsLoading,
        page,
        postList,
        setPostList,
        totalPage,
        setTotalPage,
        addPost,
        handleNextPage,
        handlePrevPage,
        handleDeletePost,
        handlePageChange,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export const usePosts = () => useContext(PostContext);
export const useAdminPosts = () => useContext(AdminPostContext);
