import pLimit from "p-limit"
import { readFileAsPreviewDataURL } from "./Utils"

const limit = pLimit(10)

export class PreviewableFile extends File {
	public preview: Promise<string>

	constructor(
		file: File
	) {
		super([file], file.name, {})
		this.preview = limit(async () => await readFileAsPreviewDataURL(file))
	}

	static async getFilePreview(file: File) {
		if (file instanceof PreviewableFile) {
			return file.preview
		}
		return await limit(async () => await readFileAsPreviewDataURL(file))
	}

	static getMixedFilePreview(file: string | File) {
		if (typeof file === "string") {
			return file
		}
		return this.getFilePreview(file)
	}

}