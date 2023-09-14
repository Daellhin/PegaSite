import type { FirebaseError } from "firebase/app"

export function logFirebaseError(error: FirebaseError) {
	console.error("code", error.code)
	console.error("cause", error.cause)
	console.error("customData", error.customData)
	console.error("name", error.name)
	console.error("message", error.message)
	console.error("stack", error.stack)
}

export function handleFirebaseError(error: any) {
	if (error as FirebaseError) {
		const firebaseEror = error as FirebaseError
		if ((firebaseEror.customData as any)?.message?.includes("NetworkError"))
			return "Probleem met het netwerk"
		else if (firebaseEror.code === "auth/email-already-in-use")
			return "Er bestaat al een gebruiker met dit emailadres"
		else if (firebaseEror.code === "auth/invalid-email")
			return "Het opgegeven emailadres is ongeldig"
		else {
			logFirebaseError(firebaseEror)
			return firebaseEror.message
		}
	} else {
		console.error(error)
		return "Ongekend probleem, probeer het later opnieuw"
	}
}
