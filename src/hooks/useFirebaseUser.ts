import initializeFirebaseClient from "@src/configs/initFirebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface UserWithRole extends User {
    role?: string;
}

export default function useFirebaseUser() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<UserWithRole | null>(null);
    const { auth, db } = initializeFirebaseClient();

    useEffect(() => {
        const listener = onAuthStateChanged(auth, async (loginUser) => {
            if (loginUser) {
                const docRef = doc(db, "users", loginUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUser({ ...loginUser, role: docSnap.data()?.role });
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        })
        return () => {
            listener();
        }
    }, [auth]);

    return { isLoading, user };
}
