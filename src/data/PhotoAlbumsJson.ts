import type { PhotoAlbumJson } from "$lib/domain/PhotoAlbum"
import { Timestamp } from "firebase/firestore"

export const PHOTO_ALBUM: PhotoAlbumJson = {
    // id: "0",
    createdAt: new Timestamp(Math.round(Date.now() / 1000), 0),
    date: new Timestamp(Math.round(Date.now() / 1000), 0),
    author: "Author",
    authorUrl: "https://www.google.com/",
    title: "Mock Photo Album",
    imageIds: Array(20).fill(0).map((_, i) => i.toString()),
    visible: true,
}

export const PHOTO_ALBUMS_JSON: PhotoAlbumJson[] = [PHOTO_ALBUM]
