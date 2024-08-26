
import type { AnnouncementJson } from "$lib/domain/Announcement"
import { Timestamp } from "firebase/firestore"

export const ANNOUNCEMENT: AnnouncementJson = {
	// id: "0",
	createdAt: new Timestamp(Math.round(Date.now() / 1000), 0),
	title: "Mock Announcement",
	content: "Mock announcement content",
	visible: true,
	dismissible: true
}

export const ANNOUNCEMENTS_JSON: AnnouncementJson[] = [ANNOUNCEMENT]
