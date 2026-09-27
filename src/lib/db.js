import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export const getPublishedLinks = async () => {
  const q = query(
    collection(db, "link99_links"),
    where("published", "==", true),
    orderBy("order", "asc")
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getCategories = async () => {
  const snapshot = await getDocs(collection(db, "link99_categories"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
