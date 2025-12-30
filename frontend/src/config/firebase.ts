// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDmoBJYYdDT7A-5xVJqOchGF-d5-uFuA8A",
    authDomain: "closetesting-app.firebaseapp.com",
    projectId: "closetesting-app",
    storageBucket: "closetesting-app.firebasestorage.app",
    messagingSenderId: "1067682710702",
    appId: "1:1067682710702:web:e97d4ee1cded325663193f",
    measurementId: "G-SDHJLYGRKG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Get the ID token
        const idToken = await user.getIdToken();

        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
            },
            idToken
        };
    } catch (error: any) {
        console.error('Google sign-in error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Sign out
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error: any) {
        console.error('Sign out error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Get current user
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return auth.onAuthStateChanged(callback);
};

export { auth, analytics };
export default app;
