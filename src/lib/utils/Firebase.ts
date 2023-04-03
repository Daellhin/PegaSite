import type { FirebaseError } from "firebase/app"

export function logFirebaseError(error: FirebaseError) {
    console.error("code", error.code)
    console.error("cause", error.cause)
    console.error("customData", error.customData)
    console.error("name", error.name)
    console.error("message", error.message)
    console.error("stack", error.stack)
}