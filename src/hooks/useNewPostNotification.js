import { useEffect, useState } from "react";

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/api/firebase/firebase";

export function useNewPostNotification() {
  const [lastestPost, setLastestPost] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "post"),
      orderBy("createDate", "desc"),
      limit(1),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const doc = snapshot.docs[0];

      if (!doc) return;

      setLastestPost({
        id: doc.id,
        ...doc.data(),
      });
    });

    return () => unsubscribe();
  }, []);

  return lastestPost;
}
