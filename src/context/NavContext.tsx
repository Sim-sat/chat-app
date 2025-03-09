import {createContext, ReactNode, useState} from "react";

interface State {
    location: string;
    setLocation: (location: string) => void;
}

interface DispatchProps {
    children: ReactNode;
}

export const NavContext = createContext<State | undefined>(undefined);

export const NavProvider = ({children}: DispatchProps) => {
    const [location, setLocation] = useState<string>("");

    return (
        <NavContext.Provider value={{location, setLocation}}>
            {children}
        </NavContext.Provider>
    )
}