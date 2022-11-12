import JSZip, { file } from "jszip";
import { defaultPackJSON } from "../context/SFXItems";
import { AudioFileWithCustom, PackJSON } from "../types";
import filesList from "./../data/files.json";

export const initiateDownload = (href: string, download: string) => {
    let link = document.createElement("a");

    link.href = href;
    link.download = download;

    link.click();
    link.remove();
}

// type guard
const isFile = (source: any): source is File => {
    return (source as File).type !== undefined;
} 

export const playAudio = (source: File | string) => {
    if (isFile(source)) {
        let fr: FileReader = new FileReader();
        fr.readAsDataURL(source);
        let blob: Blob = new Blob([source], { type: `application/${source.type}` });
        let url: string = window.URL.createObjectURL(blob);
    
        let audio: HTMLAudioElement = new Audio(url);
        audio.play();
    } else {
        let audio: HTMLAudioElement = new Audio(source);
        audio.play();
    }
}

export const loadPackJSON = async (files: FileList): Promise<PackJSON | null> => {
    try {
        let pack: PackJSON | null = defaultPackJSON;
        let fileArr: File[] = Array.from(files);
        
        for (let i = 0; i < fileArr.length; i++) {
            if (fileArr[i].name.toLowerCase() === "pack.json") {
                let file: File = fileArr[i];
                let fr = new FileReader();

                fr.readAsDataURL(fileArr[i]);
                let blob: Blob = new Blob(
                    [file], 
                    { type: 'application/json' }
                );

                let text: string = await blob.text();

                let obj = JSON.parse(text);

                pack = {
                    ...defaultPackJSON,
                    name: obj.name ?? defaultPackJSON.name,
                    author: obj.author ?? defaultPackJSON.author,
                    description: obj.description ?? defaultPackJSON.description
                }

                break;
            }
        }

        return pack;
    }
    catch (error) {
        console.log((error as Error).message);
        return null;
    }
}

export const generatePackZip = async (pack: PackJSON, files: AudioFileWithCustom[]) => {
    let zip: JSZip = new JSZip();

    files.map(
        (f: AudioFileWithCustom) => {
            if (f.replacement) {
                zip.file(f.fileName, f.replacement);
            }
        }
    )
    
    let blob = new Blob(
        [JSON.stringify(pack, null, 2)], 
        {type: "application/json",}
    );
    let jsonFile = new File(
        [blob], 
        "pack.json", 
        { type: "application/json" }
    );

    zip.file("pack.json", jsonFile);

    let zipBlob: Blob = await zip.generateAsync({ type: "blob" });
    let url: string = window.URL.createObjectURL(zipBlob);

    initiateDownload(url, "SDeckFX.zip");
}

export const generatePackZipMusicOnly = async (files: AudioFileWithCustom[]) => {
    let zip: JSZip = new JSZip();

    files.map(
        (f: AudioFileWithCustom) => {
            if (f.replacement) {
                zip.file(f.fileName, f.replacement);
            }
        }
    )

    let zipBlob: Blob = await zip.generateAsync({ type: "blob" });
    let url: string = window.URL.createObjectURL(zipBlob);

    let link = document.createElement("a");
    link.href = url;
    link.download = "SDeckFX.zip";
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export const downloadCustomSFX = (fileName: string, custom: File, format: string = "wav") => {
    let fr: FileReader = new FileReader();
    fr.readAsDataURL(custom);

    let blob: Blob = new Blob([custom], { type: `application/${ format}` });
    let url: string = window.URL.createObjectURL(blob);

    let link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
}


export const fileSizeToString: Function = (bytes: number, decimals: number = 2): string => {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = (decimals < 0) 
        ? 0 
        : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}