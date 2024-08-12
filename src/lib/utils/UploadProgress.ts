export enum UploadProgress {
	NOT_STARTED = 0,
	CONVERTING = 1,
	UPLOADING = 2,
	DONE = 3
}

export function toString(uploadProgress: UploadProgress) {
	switch (uploadProgress) {
		case UploadProgress.NOT_STARTED: return "Not started"
		case UploadProgress.CONVERTING: return "Converting"
		case UploadProgress.UPLOADING: return "Uploading"
		case UploadProgress.DONE: return "Done"
	}
}