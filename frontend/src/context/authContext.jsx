import axios from "axios";
import Cookies from 'js-cookie';
import { AppRoutes } from "../constant/constant";
import { createContext, useEffect, useState } from "react";
// import PageLoaderComp from "../components/loader/pageLoader";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(false);
    console.log("userInContext-->", user)
    useEffect(() => {

        if (!user) {
            const token = Cookies.get("token")
            if (token) {
                getUser()
            }
        }
    }, [user]);

    const getUser = () => {
        axios.get(AppRoutes.getMyInfo, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`
            }
        }).then((res) => {
            // setLoading(true)
            setUser(res?.data?.data)
        }).catch((err) => {
            console.log("errInGetUser==>", err)
        }).finally(() => {
            // setLoading(false);
        });
    }


    // if (loading) {
    //     return <PageLoaderComp center={true} />
    // }
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

