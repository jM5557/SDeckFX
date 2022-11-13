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
    music: boolean,
    ignore: [],
    mappings: any
}

export type SFXPack = {
    id: string,
    packJSON: PackJSON,
    files: AudioFileWithCustom[]
}

export type AudioFileWithCustom = AudioFile & { replacement: File[] | null };