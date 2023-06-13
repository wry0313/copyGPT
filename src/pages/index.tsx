import Image from 'next/image'
import { v4 } from "uuid";
import { useState, useRef, useEffect } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import React from 'react';


firebase.initializeApp({
  apiKey: "AIzaSyChLYmtSUbgD0aQs6LV2Wfl5zLxoI_vOSY",
  authDomain: "chatroom-2921f.firebaseapp.com",
  projectId: "chatroom-2921f",
  storageBucket: "chatroom-2921f.appspot.com",
  messagingSenderId: "814556940279",
  appId: "1:814556940279:web:9aa024401096ed8847d0f2",
  measurementId: "G-B7RCNTZE2K"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

export default function Home() {
  const [user] = useAuthState(auth as any);
  return (
    <div className="w-[40rem] mx-auto">
      <div className="p-3 flex flex-row justify-between rounded-xl shadow mb-3">
        <h1>Welcome to the Chatroom!</h1>
        <SignOut />
        {!user && <SignIn />}
      </div>
      {user && <Chatroom />}
    </div>
  )
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Chatroom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt', 'desc').limit(30);
  const [messages] = useCollectionData<Message>(query as any);
  const dummy = useRef<HTMLDivElement>(null);
  // use this query and listen to any updates the date in real time with the use collection data hook it returns an array of objects where each object is the chat message and the database. everytime the chat changes, react will rerender the messages

  const [formValue, setFormValue] = useState('');

  useEffect(()=>{
    dummy.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // normally when a form is submitted it will refresh the page but we can prevent that from happening

    if (!formValue) {
      return;
    }
    const { uid, photoURL } = auth.currentUser || {};


    messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      id: v4()
    });
    setFormValue('')
  }
  return (
    <div id="chatroom">
      <div className="overflow-auto h-[41rem]">
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />).reverse()}
        <div ref={dummy} className=""></div>
      </div>
      <form onSubmit={sendMessage} className='border-[1px] mb-3 w-[40rem] fixed bottom-0'>
        <input className='px-2 h-[3rem] w-[100%] rounded ' value={formValue} onChange={(e) => setFormValue(e.target.value)} />
      </form>
    </div>
  )
}

interface Message {
  text: string;
  uid: string;
  id: string;
  photoURL: string;
}

function ChatMessage({ message }: { message: Message }) {
  const { text, uid, photoURL } = message;

  const isCurrentUser = uid === auth.currentUser?.uid;

  return (
    <div className={`p-3 mb-3 border flex flex-row${isCurrentUser ? '-reverse' : ''} shadow rounded-xl`}>
      <img className="rounded-full shadow-xl h-fit" src={photoURL} alt={isCurrentUser ? 'my-user-profile' : 'user-profile'} width={30} height={30} />
      <p className="mx-3">{text}</p>
    </div>
  );

}