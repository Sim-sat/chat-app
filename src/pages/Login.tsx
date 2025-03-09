import {AuthenticationForm} from "../components/AuthenticationForm.tsx";
import {toast, ToastContainer} from "react-toastify";

export default function Login() {

    const handleError = (error: Error) => {
        toast.error(error.message);
    }

    return (
        <div className="flex border w-screen justify-center items-center h-screen gap-5">
            <AuthenticationForm handleError={handleError} className="scale-125"/>
            <ToastContainer/>
        </div>
    )
}