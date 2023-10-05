import { readFileAsDataURL } from "./Utils"

export class PreviewableFile extends File {
	public preview: Promise<string>

	constructor(
		file: File
	) {
		super([file], file.name, {})
		this.preview = readFileAsDataURL(file)
	}

	static getFilePreview(file: File) {
		if (file instanceof PreviewableFile) {
			return file.preview
		}
		return readFileAsDataURL(file)
	}
	
	static getMixedFilePreview(file: string|File) {
		if (typeof file === "string") {
			return file
		}
		return this.getFilePreview(file)
	}

}