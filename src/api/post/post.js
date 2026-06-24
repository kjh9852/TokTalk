import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  startAfter,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export function subscribeMeta(callback) {
  const metaRef = doc(db, "posts", "meta");
  return onSnapshot(metaRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data().totalPage || 1);
    } else {
      callback(1);
    }
  });
}

export function subscribePosts(pageNum, callback) {
  const pageRef = doc(db, "posts", `page_${pageNum}`);

  const unsubscribe = onSnapshot(pageRef, (snapshot) => {
    if (snapshot.exists()) {
      const items = snapshot.data().items || [];
      console.log(items);
      callback(items);
    } else {
      callback([]);
    }
  });

  return unsubscribe;
}

export async function uploadFirebase(content, userName) {
  const postRef = doc(collection(db, "post"));

  await setDoc(postRef, {
    content,
    userName,
    createDate: new Date().toISOString(),
  });
}

export async function getTotalPage(pageSize = 6) {
  const postRef = collection(db, "post");
  const snapShot = await getCountFromServer(postRef);
  const totalCount = snapShot.data().count;
  const totalPage = Math.ceil(totalCount / pageSize);
  return totalPage;
}

export async function getPage({ pageSize = 6, startDoc = null }) {
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

export async function getPost(pageNum) {
  const pageRef = doc(db, "posts", `page_${pageNum}`);
  const pageSnap = await getDoc(pageRef);
  console.log(pageSnap);

  if (pageSnap.exists()) {
    return pageSnap.data().items || [];
  }
  return [];
}

export async function uploadPost(content, userName) {
  const metaRef = doc(db, "posts", "meta");

  await runTransaction(db, async (transaction) => {
    const metaSnap = await transaction.get(metaRef);

    let currentPage = 1;
    let totalPage = 1;

    if (metaSnap.exists()) {
      currentPage = metaSnap.data().currentPage;
      totalPage = metaSnap.data().totalPage || currentPage;
    } else {
      transaction.set(metaRef, { currentPage: 1, totalPage: 1 });
    }

    const pageRef = doc(db, "posts", `page_${currentPage}`);
    const pageSnap = await transaction.get(pageRef);

    let items = [];
    if (pageSnap.exists()) {
      items = pageSnap.data().items || [];
    }

    if (items.length >= 6) {
      currentPage++;
      totalPage = currentPage;
      transaction.update(metaRef, { currentPage, totalPage });
      transaction.set(doc(db, "posts", `page_${currentPage}`), {
        items: [
          {
            content,
            userName,
            createDate: new Date().toISOString(),
          },
        ],
      });
    } else {
      items.push({
        content,
        userName,
        createDate: new Date().toISOString(),
      });
      transaction.set(pageRef, { items }, { merge: true });
    }
  });
}

export async function deletePost(postId) {
  const postRef = doc(db, "post", postId);

  try {
    await deleteDoc(postRef);
  } catch (error) {
    console.log(error);
  }
}
