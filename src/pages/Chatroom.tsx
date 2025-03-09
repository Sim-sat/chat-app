import {InputWithButton} from "../components/InputWithButton.tsx";
import {auth, db} from "../firebase.tsx";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {
    addDoc,
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    serverTimestamp,
    where
} from "firebase/firestore";
import {useEffect, useState} from "react";
import {Message} from "../Types.tsx";

export default function Chatroom() {

    const [messages, setMessages] = useState<Message[]>([]);
    const sendMessage = async (message: string) => {
        if (message.trim() === "") {
            toast.error('No empty messages allowed', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }

        const {uid, displayName, photoURL} = auth.currentUser!;
        await addDoc(collection(db, "messages"), {
            text: message,
            name: displayName!,
            avatar: photoURL!,
            createdAt: serverTimestamp(),
            uid: uid,
            to: "chatroom",
        });

    }

    useEffect(() => {
        const q = query(
            collection(db, "messages"),
            where("to", "==", "chatroom"),
            orderBy("createdAt", "desc"),
            limit(50)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot: QuerySnapshot<Message>) => {
            const fetchedMessages: Message[] = [];
            QuerySnapshot.forEach((doc: QueryDocumentSnapshot<Message>) => {
                fetchedMessages.push({...doc.data(), id: doc.id});
            });
            const sortedMessages = fetchedMessages.sort(
                (a: Message, b: Message) => a.createdAt - b.createdAt
            );
            setMessages(sortedMessages);
        });
        return () => {
            unsubscribe()
        };
    }, []);


    return (
        <div className="bg-secondary h-full pb-2 rounded-xl  border-r border-slate-200 flex flex-col">
            <div className="h-[98%]  overflow-y-scroll p-5 text-md gap-5 flex flex-col ">
                {messages.map((message) =>
                    (
                        <div key={message.id} className={`p-2 border rounded-xl flex-row gap-2 flex max-w-2/3 ${
                            message.uid === auth.currentUser?.uid ? "self-end" : "self-start"
                        }`}>
                            {message.avatar && <img src={message.avatar} className="w-10 h-10 rounded-full" alt=""/>}
                            <div>
                                <p className="font-bold">{message.name ? message.name : "Anonym"}</p>
                                <p>{message.text}</p>
                            </div>
                        </div>))}
            </div>
            <div className="mx-5">
                <InputWithButton sendMessage={sendMessage}/>
            </div>
            <ToastContainer
                pauseOnFocusLoss={false}/>
        </div>
    )
}