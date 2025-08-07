import { getFirestore } from "firebase/firestore";
import { app } from "../../Backend/auth/firebase"; // Your firebase config file

const db = getFirestore(app);

export { db };