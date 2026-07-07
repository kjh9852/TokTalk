import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function uploadPost({ content, userName }) {
  try {
    const postRef = doc(collection(db, "post"));

    await setDoc(postRef, {
      content,
      userName,
      createDate: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTotalPage(pageSize = 6) {
  const postRef = collection(db, "post");
  const snapShot = await getCountFromServer(postRef);
  const totalCount = snapShot.data().count;
  const totalPage = Math.ceil(totalCount / pageSize);
  return totalPage;
}

export async function getPost({ pageSize = 6, startDoc = null }) {
  const postRef = collection(db, "post");
  let q = query(postRef, orderBy("createDate", "desc"), limit(pageSize));

  if (startDoc) {
    q = query(
      postRef,
      orderBy("createDate", "desc"),
      startAfter(startDoc),
      limit(pageSize),
    );
  }

  const snapShot = await getDocs(q);

  const posts = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const lastDoc = snapShot.docs[snapShot.docs.length - 1];

  return { posts, lastDoc };
}

export async function deletePost(postId) {
  try {
    const postRef = doc(db, "post", postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
