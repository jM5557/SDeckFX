import { useState } from "react";
import { AudioFile, AudioFileWithReplacement } from "../types";
import Files from "./../data/files.json";

import JSZip from "jszip";

const useFiles = () => {
    const [files, setFiles] = useState<AudioFileWithReplacement[]>(
        (Files as AudioFile[]).map((f: AudioFile) => ({ ...f, replacement: null }))
    );

    const [zipStatus, setZipStatus] = useState<"IDLE" | "ZIPPING">("IDLE");

    const handleClearAll: Function = () => {
        let temp: typeof files = files.map(
            (f: AudioFileWithReplacement) => {
                f.replacement = null;
                return f;
            }
        );
        setFiles(temp);
    }

    const updateReplacement = (
        index: number,
        replacement: AudioFileWithReplacement["replacement"]
    ) => {
        let temp: typeof files = [...files];
        temp[index].replacement = replacement;

        setFiles(temp);
    }

    const saveAsZip = async () => {
        setZipStatus("ZIPPING");
        let zip = new JSZip();

        files.map(
            (f: AudioFileWithReplacement) => {
                if (f.replacement) {
                    zip.file(f.fileName, f.replacement);
                }
            }
        )

        let blob: Blob = await zip.generateAsync({ type: "blob" });
        let url: string = window.URL.createObjectURL(blob);
        
        setTimeout(() => {
            let link = document.createElement("a");
            link.href = url;
            link.download = "SDeckFX.zip";
            document.body.appendChild(link);
            link.click();
            link.remove();
            setZipStatus("IDLE");
        }, 1000);
    }

    const containsReplacements: boolean = files.some((f: AudioFileWithReplacement) => f.replacement);

    return {
        files,
        setFiles,
        handleClearAll,
        updateReplacement,
        containsReplacements,
        saveAsZip,
        zipStatus
    } as const;
}

export default useFiles;