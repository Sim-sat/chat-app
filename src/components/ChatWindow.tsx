import {InputWithButton} from "../components/InputWithButton.tsx";
import {auth, db} from "../firebase.tsx";
import {Bounce, toast, ToastContainer} from "react-toastify";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    serverTimestamp,
    where,
} from "firebase/firestore";
import {useEffect, useState} from "react";
import {Chat, Message} from "../Types.tsx";
import {ButtonMenu} from "./ButtonMenu.tsx";


interface Props {
    chat: Chat;
    profilePicture: string;
    setCurrentChat: (n: null) => void;
}

export default function ChatWindow(props: Props) {

    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesSent, setMessagesSent] = useState<Message[]>([]);
    const [messagesReceived, setMessagesReceived] = useState<Message[]>([]);

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
        if (auth.currentUser) {
            await addDoc(collection(db, "messages"), {
                text: message,
                name: displayName!,
                avatar: photoURL!,
                createdAt: serverTimestamp(),
                uid: uid,
                to: getOtherUid(props.chat.uid, auth.currentUser?.uid),
            });
        }


    }
    useEffect(() => {
        if (auth.currentUser) {
            const currentUid = auth.currentUser?.uid;
            const otherUid = getOtherUid(props.chat.uid, currentUid);

            const q1 = query(
                collection(db, "messages"),
                where("to", "==", currentUid),
                where("uid", "==", otherUid),
                orderBy("createdAt", "desc"),
                limit(50)
            );

            const q2 = query(
                collection(db, "messages"),
                where("to", "==", otherUid),
                where("uid", "==", currentUid),
                orderBy("createdAt", "desc"),
                limit(50)
            );
            const unsubscribeReceived = onSnapshot(q1, (QuerySnapshot: QuerySnapshot<Message>) => {
                const fetchedMessages: Message[] = [];


                QuerySnapshot.forEach((doc: QueryDocumentSnapshot<Message>) => {
                    fetchedMessages.push({...doc.data(), id: doc.id});
                });
                const sortedMessages = fetchedMessages.sort(
                    (a: Message, b: Message) => a.createdAt - b.createdAt
                );
                setMessagesReceived(sortedMessages);
            });

            const unsubscribeSent = onSnapshot(q2, (QuerySnapshot: QuerySnapshot<Message>) => {
                const fetchedMessages: Message[] = [];
                QuerySnapshot.forEach((doc: QueryDocumentSnapshot<Message>) => {
                    fetchedMessages.push({...doc.data(), id: doc.id});
                });
                const sortedMessages = fetchedMessages.sort(
                    (a: Message, b: Message) => a.createdAt - b.createdAt
                );
                setMessagesSent(sortedMessages);
            });


            return () => {
                unsubscribeSent();
                unsubscribeReceived();
            };
        }
    }, []);

    useEffect(() => {
        const allMessages = [...messagesSent, ...messagesReceived];
        const sortedMessages = allMessages.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(sortedMessages);
    }, [messagesSent, messagesReceived]);


    const getOtherUid = (uids: string, currentUid: string): string => {
        const [uid1, uid2] = uids.split("-");
        return uid1 === currentUid ? uid2 : uid1;
    };

    const deleteChat = async () => {
        await deleteDoc(doc(db, "chats", props.chat.uid))
            .then(() => props.setCurrentChat(null))
            .catch((error: Error) => {
                console.error(error)
            });
    }

    return (
        <div className="bg-secondary h-full pb-5 rounded-xl  border-r border-slate-200 flex flex-col">
            <div
                className="border-b border-slate-200  p-4 text-lg gap-5 flex font-bold flex-row self w-full items-center ">
                <img src={props.profilePicture} alt="" className="h-14 w-14 rounded-full"/>
                <button className="p-2 ">
                    {props.chat.participants[0] !== auth.currentUser?.displayName
                        ? props.chat.participants[0]
                        : props.chat.participants[1]}
                </button>
                <span className="ml-auto">
                    <ButtonMenu deleteChat={deleteChat}/>
                </span>
            </div>
            <div className="flex-1 overflow-y-scroll p-5   text-md gap-5 flex flex-col">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`p-4 border rounded-xl flex-row gap-2 flex max-w-2/3 ${
                            message.uid === auth.currentUser?.uid ? "self-end" : "self-start"
                        }`}
                    >
                        {message.avatar && (
                            <img src={message.avatar} className="w-10 h-10 rounded-full self-center" alt=""/>
                        )}
                        <div>
                            <p className="font-bold">{message.name ? message.name : "Anonym"}</p>
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mx-5">
                <InputWithButton sendMessage={sendMessage}/>
            </div>

            <ToastContainer pauseOnFocusLoss={false}/>
        </div>
    );
}