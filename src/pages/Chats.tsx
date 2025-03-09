import {ActionIcon, Autocomplete, Group, Stack} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    QueryDocumentSnapshot,
    QuerySnapshot,
    serverTimestamp,
    setDoc,
    where
} from "firebase/firestore";
import {auth, db} from "../firebase.tsx";
import {UserButton} from "../components/UserButton.tsx";
import {toast, ToastContainer} from "react-toastify";
import ChatWindow from "../components/ChatWindow.tsx";
import {Chat, User} from "../Types.tsx";


export default function Chats() {

    const [users, setUsers] = useState<User[]>([]);
    const [chats, setChats] = useState<Chat[]>([]);
    const [userToAdd, setUserToAdd] = useState<string>("");
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);


    useEffect(() => {
        const q = query(
            collection(db, "users"),
            orderBy("createdAt", "desc"),
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot: QuerySnapshot<User>) => {
            const fetchedUsers: User[] = [];
            QuerySnapshot.forEach((doc: QueryDocumentSnapshot<User>) => {
                fetchedUsers.push({...doc.data()});
            });
            const sortedUser = fetchedUsers.sort(
                (a: User, b: User) => a.createdAt - b.createdAt
            );
            setUsers(sortedUser);

        });
        return () => {
            unsubscribe()
        };
    }, []);

    useEffect(() => {
        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", auth.currentUser?.displayName),
            orderBy("createdAt", "desc"),
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot: QuerySnapshot<User>) => {
            const fetchedChats: Chat[] = [];
            QuerySnapshot.forEach((doc: QueryDocumentSnapshot<User>) => {
                fetchedChats.push({participants: [], ...doc.data()});
            });
            const sortedChats = fetchedChats.sort(
                (a: Chat, b: Chat) => a.createdAt - b.createdAt
            );
            setChats(sortedChats);

        });
        return () => {
            unsubscribe()
        };
    }, []);


    const addChat = async () => {

        const q = query(collection(db, "users"), where("name", "==", userToAdd));
        const foundUsers: User[] = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            foundUsers.push({
                uid: doc.data().uid,
                name: doc.data().name,
                createdAt: doc.data().createdAt,
                profilePicture: doc.data().profilePicture
            });
        })
        if (foundUsers.length == 0) {
            toast.error("No users found.");
        } else {
            if (auth.currentUser) {
                const uid = [auth.currentUser.uid, foundUsers[0].uid].sort().join("-")
                await setDoc(doc(db, "chats", uid), {
                    participants: [auth.currentUser.displayName, foundUsers[0].name],
                    createdAt: serverTimestamp(),
                    uid: uid,
                });
            }
        }
    }

    const openChatWindow = (chat: Chat) => {
        setCurrentChat(chat)
    }

    const getProfilePictureUrl = (chat: Chat): string => {
        const participants = chat.participants;
        const otherUsername = participants[0] === auth.currentUser?.displayName ? participants[1] : participants[0];
        const otherUser = users.find((user) => user.name === otherUsername);
        if (otherUser) {
            return otherUser.profilePicture;
        } else {
            return ""
        }
    }

    return (
        <div className="flex h-screen ">
            <div className="h-full border-slate-200 border-r w-1/3 max-w-2xs">
                <Group className="p-3 mt-2 flex flex-row gap-3 justify-center items-center">
                    <Autocomplete placeholder="Search for username"
                                  data={users.filter((user) => user.name !== auth.currentUser?.displayName).map(user => user.name)}
                                  onChange={setUserToAdd}/>
                    <ActionIcon className="" onClick={addChat}>
                        <IconPlus/>
                    </ActionIcon>
                </Group>
                <Stack gap="xs">
                    {chats.map((chat: Chat) => (
                        <UserButton chat={chat} profilePicture={getProfilePictureUrl(chat)}
                                    openChatWindow={openChatWindow}/>
                    ))}
                </Stack>
                <ToastContainer/>
            </div>
            <div className="h-screen  flex-1">
                {currentChat && <ChatWindow chat={currentChat} setCurrentChat={setCurrentChat}
                                            profilePicture={getProfilePictureUrl(currentChat)}/>}
            </div>
        </div>

    )
}