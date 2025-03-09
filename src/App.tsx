// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import './App.css';
import {MantineProvider} from '@mantine/core';
import {NavbarSimple} from "./components/NavbarSimple.tsx";
import AppRouter from "./router.tsx";
import {NavProvider} from "./context/NavContext.tsx";

export default function App() {
    return <MantineProvider withCssVariables withGlobalClasses>
        <div className=" h-screen overflow-clip">
            <NavProvider>
                <div className="flex flex-row h-[98%] w-screen">
                    {location.pathname !== "/" && <div className="w-1/4 max-w-[200px] h-full ">
                        <NavbarSimple/>
                    </div>}
                    <div className="w-3/4">
                        <AppRouter/>
                    </div>
                </div>
            </NavProvider>
        </div>
    </MantineProvider>;
}