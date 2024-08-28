import pLimit from "p-limit"
import { readFileAsDataURL, readFileAsPreviewDataURL } from "./Utils"

const limit = pLimit(10)

export class PreviewableFile extends File {
	public preview: Promise<string>

	constructor(
		file: File
	) {
		super([file], file.name, {})
		this.preview = limit(async () => await readFileAsPreviewDataURL(file))
	}

	static async getFilePreview(file: File, compressed: boolean = true) {
		if (file instanceof PreviewableFile) {
			return file.preview
		}
		return await limit(async () => await (compressed ? readFileAsPreviewDataURL(file) : readFileAsDataURL(file)))
	}

	static async getMixedFilePreview(file: string | File, compressed: boolean = true) {
		if (typeof file === "string") {
			return file
		}
		// TODO improve performance by checking if file is already a PreviewableFile with same compression
		return await limit(async () => await (compressed ? readFileAsPreviewDataURL(file) : readFileAsDataURL(file)))
	}

}