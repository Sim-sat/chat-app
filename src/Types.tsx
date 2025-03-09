export interface Message {
    text: string;
    name: string;
    avatar: string;
    createdAt: number;
    id: string;
    uid: string;
}

export interface Chat {
    uid: string;
    participants: string[];
    createdAt: number;
}


export interface User {
    uid: string;
    name: string;
    createdAt: number;
    profilePicture: string;
}