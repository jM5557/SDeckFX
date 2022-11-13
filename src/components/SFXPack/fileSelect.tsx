import { RefObject, SyntheticEvent, useRef } from "react"

type FileSelectProps = {
    callbackFn: Function,
    isMusic: boolean,
    className?: string
}

const FileSelect: React.FC<FileSelectProps> = ({
    callbackFn,
    isMusic = false,
    className
}): JSX.Element => {
    const ref: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    return (
        <>
            <button
                type = "button"
                onClick={
                    () => ref.current?.click()
                }
                className = { className ?? "" }
            >
                Browse
            </button>
            <input 
                type="file"
                style = {{ display: "none" }}
                ref = { ref }
                accept={ isMusic ? ".mp3" : ".wav" }
                onChange = {
                    (e: SyntheticEvent) => {
                        let files: FileList | null = (e.target as HTMLInputElement).files;

                        if (files && Array.from(files).length > 0) {
                            callbackFn(Array.from(files));
                        }
                    }
                }
                onClick = {
                    (e: SyntheticEvent) => {
                        (e.target as HTMLInputElement).value = "";
                    }
                }
                multiple
            />
        </>
    )
}

export default FileSelect;