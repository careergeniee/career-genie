import { createContext, useContext, useEffect, useRef, useState } from "react";
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
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { initUserData, clearUserData } from "@/lib/userStore";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    /**
     * Bumped once Firestore hydration (initUserData) finishes for the current
     * sign-in. Dashboard pages that seed their state from localStorage on
     * mount (useState(() => loadX())) capture whatever was there *before*
     * that hydration lands — on a fresh device this is nothing, and without
     * this signal nothing tells them to re-read once the real data arrives.
     * Consumers should key a remount (or re-run their load) off this value.
     */
    dataVersion: number;
    signup: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string, remember?: boolean) => Promise<void>;
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
    const [error, setError] = useState<string | null>(null);
    const [dataVersion, setDataVersion] = useState(0);
    const hydratedUidRef = useRef<string | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(
            auth,
            (u) => {
                setUser(u);
                setError(null);
                setLoading(false);
                if (u && hydratedUidRef.current !== u.uid) {
                    // Hydrate localStorage from Firestore once per sign-in — not on every
                    // token refresh, which would race with and clobber any local write made
                    // since the last Firestore mirror (saveData's Firestore write is fire-and-forget).
                    hydratedUidRef.current = u.uid;
                    // Rendering isn't gated on this finishing (see `loading` above), so pages
                    // already mid-render — or about to mount — can easily win the race and
                    // read localStorage before this write lands. Bumping dataVersion once it
                    // settles gives them a signal to re-read instead of staying stuck empty.
                    console.info("CareerGenie: starting Firestore hydration for uid", u.uid);
                    initUserData().finally(() =>
                        setDataVersion((v) => {
                            console.info("CareerGenie: hydration settled, bumping dataVersion", v, "->", v + 1);
                            return v + 1;
                        })
                    );
                }
                if (!u) {
                    hydratedUidRef.current = null;
                }
            },
            (err) => {
                console.error("CareerGenie: auth state listener failed —", err);
                setError(err.message);
                setLoading(false);
            }
        );
        return unsub;
    }, []);

    const signup = async (email: string, password: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(cred.user);
    };

    const login = async (email: string, password: string, remember = true) => {
        // setPersistence mutates the shared auth singleton's persistence mode for all future
        // sign-ins on this instance, not scoped to just this call. If loginWithGoogle or any
        // other sign-in method is ever added without its own setPersistence call, it will
        // silently inherit whatever mode the last email/password login attempt set.
        await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (!cred.user.emailVerified) {
            await signOut(auth);
            throw new Error("Please verify your email before logging in. Check your inbox.");
        }
    };

    const loginWithGoogle = async () => {
        await signInWithPopup(auth, new GoogleAuthProvider());
    };

    const logout = async () => {
        const outgoingUid = auth.currentUser?.uid;
        await signOut(auth);
        // Data is namespaced per uid, but still leaves it readable in localStorage on
        // shared/public machines until cleared — remove it now that the session is over.
        if (outgoingUid) clearUserData(outgoingUid);
    };

    const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

    return (
        <AuthContext.Provider value={{ user, loading, error, dataVersion, signup, login, loginWithGoogle, logout, resetPassword }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};