import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import fs from "fs";

// Read variables from .env
const env = fs.readFileSync(".env", "utf8")
  .split("\n")
  .reduce((acc, line) => {
    const [key, ...val] = line.split("=");
    if (key && val) acc[key.trim()] = val.join("=").replace(/"/g, "").trim();
    return acc;
  }, {});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function runMigration() {
  const EMAIL = "princemaurya8879@gmail.com";
  const PASSWORD = "Maurya@1947";

  try {
    console.log("Signing into Firebase...");
    await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
    console.log("Signed in successfully!");

    await addDoc(collection(db, "link99_categories"), { name: "Blockchain" });
    console.log("Added category: Blockchain");

    const migrationData = [
      {
        title: "Auth with Metamask & Connect to Network",
        url: "https://blockchainsimpleproject.netlify.app/",
        imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=600&auto=format&fit=crop",
        description: "A blockchain integration project demonstrating authentication with Metamask.",
        category: "Blockchain",
        tags: ["blockchain", "metamask", "crypto", "web3"],
        published: true,
        featured: false,
        order: 31,
        githubUrl: ""
      },
      {
        title: "Decentralized Voting System",
        url: "https://voting-system10.netlify.app/",
        imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f4eccd5?q=80&w=600&auto=format&fit=crop",
        description: "A secure and transparent decentralized voting system built on the blockchain.",
        category: "Blockchain",
        tags: ["blockchain", "voting", "dapp", "web3"],
        published: true,
        featured: false,
        order: 32,
        githubUrl: ""
      }
    ];

    for (const link of migrationData) {
      await addDoc(collection(db, "link99_links"), {
        ...link,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Imported: ${link.title}`);
    }

    console.log("Migration Complete!");
    process.exit(0);
  } catch (e) {
    console.error("Migration failed:", e);
    process.exit(1);
  }
}

runMigration();
