import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { useState, useRef, useEffect } from "react";
import { v4 } from "uuid";
import UploadForm from "@/components/UploadForm";

firebase.initializeApp({
  // your firebase config
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
          <h1 className="font-bold text-3xl">Welcome to the CopyGPT 😳</h1>
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
  return <button className="shadow px-1 border rounded" onClick={signInWithGoogle}>Sign in with Google🚀</button>;
}

function SignOut() {
  return <button className="shadow px-1 border rounded" onClick={() => auth.signOut()}>Sign Out😰💨</button>;
}

function Chatroom() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(20);
  const [messages] = useCollectionData<Message>(query as any);

  const [prompt, setPrompt] = useState("");
  const [displayText, setDispalyText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const handleSetContent = (content: string) => {
    console.log(content);
    if (content) {
      setPrompt(content);
    }
  };
  // use this query and listen to any updates the date in real time with the use collection data hook it returns an array of objects where each object is the chat message and the database. everytime the chat changes, react will rerender the messages

  const [formValue, setFormValue] = useState("");
  const dummy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // normally when a form is submitted it will refresh the page but we can prevent that from happening

    if (!prompt) {
      setDispalyText(
        "you must submit your imessage chat.db file and click upload"
      );
      return;
    }
    if (!apiKey) {
      setDispalyText("you must input your openAi api key");
      return;
    }
    if (!formValue) {
      return;
    }
    const { uid, photoURL } = auth.currentUser || {};
    const userInput = formValue;
    setFormValue("");

    messagesRef.add({
      text: userInput,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      id: v4(),
    });

    setDispalyText("bot is typing...");

    const res = await fetch(
      `/api/openai?input=${userInput}&prompt=${prompt}&apiKey=${apiKey}`
    );
    const data = await res.json();

    messagesRef.add({
      text: data.choices[0].message.content,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: "bot1",
      photoURL: "openai-icon.png",
      id: v4(),
    });

    setDispalyText("");
  };
  return (
    <div id="chatroom">
      <UploadForm handleSetContent={handleSetContent}></UploadForm>
      
      <div className="my-3 flex flex-row">
        <input
          className="px-2 min-h-[2rem] w-[100%] rounded border-[1px]"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="input your open ai api key here..."
        />
      </div>
      {apiKey && <p className="my-3">Your API key is set 👏</p>}

      <div className="border rounded px-2 pt-2 overflow-auto h-[55vh] no-scrollbar">
        {messages &&
          messages
            .map((msg) => <ChatMessage key={msg.id} message={msg} />)
            .reverse()}
        <div ref={dummy} className=""></div>
      </div>
      <form onSubmit={sendMessage} className="my-3">
        <div>{displayText}</div>
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
