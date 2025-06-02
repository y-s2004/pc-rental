'use client'

import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";


export default function HomeRedirect(){
    const [cookies] = useCookies(["token"]);
    const router = useRouter();

    useEffect(() => {
        if(cookies.token){
            router.replace("/home");
        } else {
            router.replace("login");
        }
    }, [cookies.router]);

    return null;
}

