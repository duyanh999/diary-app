import { firebase_app } from "../config";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);

async function addData(collection, id, data) {
  let result = null;
  let error = null;

  try {
    await setDoc(doc(db, collection, id), data, { merge: true });
    result = `Document ${id} in collection ${collection} successfully written.`;
  } catch (e) {
    error = e;
  }

  return { result, error };
}

export default addData;
