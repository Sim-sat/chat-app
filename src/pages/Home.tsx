import {useContext} from "react";
import {NavContext} from "../context/NavContext.tsx";
import Chatroom from "./Chatroom.tsx";
import Chats from "./Chats.tsx";
import Profile from "./Profile.tsx";

export default function Home() {

    const context = useContext(NavContext);
    if (!context) {
        throw new Error("No COntext")
    }
    const {location} = context;

    return (
        <div className="h-full w-full">
            {location === "Chatroom" && <Chatroom/>}
            {location === "Chats" && <Chats/>}
            {location === "Profile" && <Profile/>}
        </div>
    )
}