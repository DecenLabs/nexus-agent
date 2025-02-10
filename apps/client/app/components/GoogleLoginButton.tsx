import { AccountContext } from "@/app/lib/context"
import { useContext, useState } from "react"
import { FaRegCircleUser } from "react-icons/fa6"
import Link from "next/link"

import { usePathname } from "next/navigation"
import BaseModal from "@/app/components/modals/base"
import { AiFillGoogleCircle } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa6";


const GoogleLoginButton = () => {

    const [modal, setModal] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const path = usePathname()

    const { isConnected, redirectToAuthUrl, logout }: any = useContext(AccountContext)
    
    console.log("GoogleLoginButton - Context values:", { 
        isConnected, 
        hasRedirectFunction: !!redirectToAuthUrl 
    });

    const handleLogin = async () => {
        console.log("handleLogin - Starting login process");
        try {
            setIsLoading(true);
            if (redirectToAuthUrl) {
                console.log("handleLogin - Calling redirectToAuthUrl");
                await redirectToAuthUrl();
            } else {
                console.error("handleLogin - redirectToAuthUrl is undefined");
            }
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>

            <BaseModal
                visible={modal}
                close={() => setModal(false)}
                title="Select Authentication Method"
                maxWidth="max-w-sm"
            >
                <p className="text-gray-300">
                    Choose an available option below to sign in
                </p>
                <div>
                    <button 
                        onClick={handleLogin} 
                        disabled={isLoading}
                        className="mt-4 w-full flex flex-row cursor-pointer  bg-orange-400 hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                        {isLoading ? (
                            <span>Loading...</span>
                        ) : (
                            <>
                                <AiFillGoogleCircle size={30} />
                                <div className="my-auto ml-2">
                                    Sign in with Google
                                </div>
                                <FaArrowRight className="ml-auto my-auto" />
                            </>
                        )}
                    </button>
                </div>

            </BaseModal>

            {!isConnected && (
                <button onClick={() => {
                    setModal(true)
                }} className={`hidden md:block cursor-pointer bg-orange-400 hover:bg-orange-200 text-white font-bold py-2 px-4 rounded-xl transition `}>
                    Login <span className="hidden md:inline-block">with zkLogin</span>
                </button>
            )}

            {isConnected && (
                <Link href="/account" className="w-[150px]">
                    <FaRegCircleUser size={24} className={`my-auto mx-auto cursor-pointer mb-0.5 ${path === "/account" ? "text-purple-400" : "text-white hover:text-purple-400"} `} />
                </Link>
            )}
        </>
    )
}

export default GoogleLoginButton