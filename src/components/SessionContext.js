import React, {createContext, useState, useCallback, useEffect} from "react";
import {authManager} from "../api/authManager";

export const SessionContext = createContext(null);
export function SessionContextProvider({children}) {
    const [auth, setAuth] = useState(authManager.load);
    useEffect(() => {
        authManager.onAuthChange = (auth, oldAuth) => {
            setAuth(auth);
        }
    },[]);

    return (
        <SessionContext.Provider value={{
            auth,
            login: authManager.login,
            logout: authManager.logout,
            authenticated: authManager.authenticated,
            hasAuthority: authManager.hasAuthority,
            hasAnyAuthority: authManager.hasAuthority}}>
            {children}

        </SessionContext.Provider>
    );
};