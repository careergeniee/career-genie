import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { initUserData } from "@/lib/userStore";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signup: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                // Hydrate localStorage from Firestore so data is available across devices
                await initUserData();
            }
            setLoading(false);
        });
        return unsub;
    }, []);

    const signup = async (email: string, password: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(cred.user);
    };

    const login = async (email: string, password: string) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (!cred.user.emailVerified) {
            await signOut(auth);
            throw new Error("Please verify your email before logging in. Check your inbox.");
        }
    };

    const loginWithGoogle = async () => {
        await signInWithPopup(auth, new GoogleAuthProvider());
    };

    const logout = () => signOut(auth);

    const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout, resetPassword }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};