import { createContext, use, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
const AuthContext = createContext();
export const useAuth = () => {
    return useContext(AuthContext);
}
const googleProvider = new GoogleAuthProvider();
//authProvider
export const AuthProvide = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const registerUser = async (email,password) =>{
        return await createUserWithEmailAndPassword(auth, email, password);
    }

    const loginUser = async (email, password) => {
        return await signInWithEmailAndPassword(auth, email, password);
    }
    // sign in with google
    const signInWithGoogle = async () => {
        return await signInWithPopup(auth, googleProvider);

    }

    const logout = () => {
        return signOut(auth)
    }
    //manage user
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            if(user){
                const {email,displayName,photoURL} = user;
                const userData = {
                    email,username: displayName,photo: photoURL
                }
            }
        });
        return () => unsubscribe();
    },[])

    const value = {
        loading,
        currentUser,
        registerUser ,
        loginUser,
        signInWithGoogle,
        logout
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}