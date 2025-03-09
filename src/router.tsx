import {lazy, ReactElement, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import {UserContextProvider} from "./context/UserContext";

const Login = lazy(() => import ("./pages/Login.tsx"));
const Chatroom = lazy(() => import("./pages/Chatroom"));
const Home = lazy(() => import("./pages/Home"))

const AppRouter = (): ReactElement => {
    return (
        <UserContextProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/chatroom" element={<Chatroom/>}/>
                    <Route path="/home" element={<Home/>}/>
                </Routes>
            </Suspense>
        </UserContextProvider>
    )
}

export default AppRouter;