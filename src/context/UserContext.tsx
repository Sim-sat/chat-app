import {createContext, ReactNode, useState} from "react";

export interface UserContextType {
    username: string,
    setUsername: (name: string) => void,
    loggedIn: boolean,
    setLoggedIn: (loggedIn: boolean) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

interface ProviderProps {
    children: ReactNode;
}

export const UserContextProvider: React.FC<ProviderProps> = ({children}) => {
    const [username, setUsername] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    return <UserContext.Provider value={{username, setUsername, loggedIn, setLoggedIn}}>
        {children}
    </UserContext.Provider>
}