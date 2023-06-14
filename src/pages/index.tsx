import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { useState, useRef, useEffect } from "react";
import { v4 } from "uuid";

firebase.initializeApp({
  apiKey: "AIzaSyChLYmtSUbgD0aQs6LV2Wfl5zLxoI_vOSY",
  authDomain: "chatroom-2921f.firebaseapp.com",
  projectId: "chatroom-2921f",
  storageBucket: "chatroom-2921f.appspot.com",
  messagingSenderId: "814556940279",
  appId: "1:814556940279:web:9aa024401096ed8847d0f2",
  measurementId: "G-B7RCNTZE2K",
});

// auth and firestore sdk as global variables for reference
const auth = firebase.auth();
const firestore = firebase.firestore();

export default function Home() {
  const [user, loading, error] = useAuthState(auth as any);
  return (
    <div className="w-[30rem] sm:w-[35rem] md:w-[40rem] mx-auto px-4 py-1">
      <div>
        <div className="p-3 flex flex-row justify-between rounded-xl shadow mb-3">
          <h1>Welcome to the Chatroom!</h1>
          {user && <SignOut />}
          {!user && <SignIn />}
        </div>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {user && <Chatroom />}
      </div>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function Chatroom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(10);
  const [messages] = useCollectionData<Message>(query as any);

  const [loading, setLoading] = useState(false);

  // use this query and listen to any updates the date in real time with the use collection data hook it returns an array of objects where each object is the chat message and the database. everytime the chat changes, react will rerender the messages

  const [formValue, setFormValue] = useState("");
  const dummy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // normally when a form is submitted it will refresh the page but we can prevent that from happening

    if (!formValue) {
      return;
    }
    const { uid, photoURL } = auth.currentUser || {};
    const content = formValue;
    setFormValue("");

    messagesRef.add({
      text: content,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      id: v4(),
    });

    setLoading(true);

    const res = await fetch(`/api/openai?content=${content}`);
    const data = await res.json();

    console.log(data.choices[0].message.content);

    messagesRef.add({
      text: data.choices[0].message.content,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: "bot1",
      photoURL: "openai-icon.png",
      id: v4(),
    });

    setLoading(false);
  };
  return (
    <div id="chatroom">
      <div className="overflow-auto h-[80vh] no-scrollbar">
        {messages &&
          messages
            .map((msg) => <ChatMessage key={msg.id} message={msg} />)
            .reverse()}
        <div ref={dummy} className=""></div>
      </div>
      <form onSubmit={sendMessage} className=" mb-3">
        {loading && <div>bot1 is typing...</div>}
        <input
          className="px-2 min-h-[3rem] w-[100%] rounded border-[1px]"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
      </form>
    </div>
  );
}

interface Message {
  text: string;
  uid: string;
  id: string;
  photoURL: string;
  createdAt: firebase.firestore.FieldValue;
}

function ChatMessage({ message }: { message: Message }) {
  const { text, uid, photoURL } = message;

  const isCurrentUser = uid === auth.currentUser?.uid;

  return (
    <div
      className={`p-3 mb-3 break-words border flex ${
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      } shadow rounded-xl`}
    >
      <img
        className="rounded-full shadow-xl h-fit"
        src={photoURL}
        alt={isCurrentUser ? "my-user-profile" : "user-profile"}
        width={30}
        height={30}
      />
      <p className={`${isCurrentUser ? "mr-3" : "ml-3"}`}>{text}</p>
    </div>
  );
}
