export type AudioFile = {
    title: string,
    description: string,
    fileName: string,
    format: "wav" | "mp3",
}

export type PackJSON = {
    name: string,
    description: string,
    author: string,
    version: string,
    manifest_version: number,
    music: false,
    ignore: [],
    mappings: {}
}