  import { initializeApp } from "firebase/app";
  import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

  const firebaseConfig = {
    apiKey: "AIzaSyDoOfYsYVwacjUAhCIo2r9DKqsRge1qmL8",
    authDomain: "studentapp-b9886.firebaseapp.com",
    projectId: "studentapp-b9886",
    storageBucket: "studentapp-b9886.firebasestorage.app",
    messagingSenderId: "715370811721",
    appId: "1:715370811721:web:78809cb7a788e109528a98"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  export { auth, provider, signInWithPopup, signOut };
