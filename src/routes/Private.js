import { useState, useEffect } from "react";
import { auth } from "../firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

const Private = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [signed, setSigned] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {
            const unsub = onAuthStateChanged(auth, (user) => {
                //se tem user logado
                if (user) {
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                    }

                    localStorage.setItem("@detailUser", JSON.stringify(userData))

                    setLoading(false);
                    setSigned(true);
                } else {
                    //nao possui user logado
                    setLoading(false);
                    setSigned(false);
                }
            })

        }

        checkLogin();

    }, [])

    if (loading) {
        return(
            <div></div>
        )
    }

    // se não estiver logado
    if (!signed) {
        return <Navigate to="/" />
    }

    return children;
}

export default Private;