import {Button, FileButton, TextInput} from "@mantine/core";
import {auth, db, storage} from "../firebase.tsx";
import {useState} from "react";

import {updateProfile} from "firebase/auth";
import {toast, ToastContainer} from "react-toastify";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {doc, updateDoc} from "firebase/firestore";

export default function Profile() {
    const currentUser = auth.currentUser;

    const [username, setUsername] = useState(currentUser?.displayName);
    const [photoUrl, setPhotoUrl] = useState(currentUser?.photoURL);

    const updateUsername = () => {
        if (auth.currentUser) {
            updateProfile(auth.currentUser, {
                displayName: username,
            }).then(() => toast.success("Profile updated successfully!"))
                .catch(() => toast.error("Error updating profile"));
        }
    }
    const upload = async (file: File | null) => {
        if (!file) {
            return;
        }
        const profilePictureRef = ref(storage, username as string);
        await uploadBytes(profilePictureRef, file).catch((error) => console.error(error));
        const url = await getDownloadURL(profilePictureRef);
        if (auth.currentUser) {
            const userRef = doc(db, "users", auth.currentUser?.uid);
            await updateProfile(auth.currentUser, {
                photoURL: url,
            }).then(async () => {
                await updateDoc(userRef, {profilePicture: url});
            })
                .then(() => toast.success("Changed Profile picture"))
                .catch(() => toast.error("Error updating profile"));
        }
        setPhotoUrl(url);

    };


    return (
        <div className="flex flex-col gap-5 h-screen p-20 max-w-lg">
            <ToastContainer/>
            <TextInput label="Username" onChange={(event) => setUsername(event.currentTarget.value)}
                       value={username ? username : ""}/>
            <Button onClick={updateUsername}>Change</Button>
            <img src={photoUrl ? photoUrl : ""} className="h-20 w-20 rounded-full" alt=""/>
            <FileButton onChange={(file) => upload(file ? file : null)} accept="image/png">
                {(props) => <Button {...props}>Upload image</Button>}
            </FileButton>
        </div>
    )
}