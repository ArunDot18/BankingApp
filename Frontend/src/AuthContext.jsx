import React, {createContext, useState, useEffect, useContext} from "react";
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        if (token && !isTokenExpired(token)) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false)
        }
    }, [token])

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    }

    const login = (newToken) => {
        setToken(newToken)
        localStorage.setItem('token', newToken)
        setIsAuthenticated(true)
    }

    const logout = () => {
        setToken(null)
        localStorage.removeItem('token')
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{token, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}