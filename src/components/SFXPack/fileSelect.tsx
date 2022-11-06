import { RefObject, SyntheticEvent, useRef } from "react"

type FileSelectProps = {
    callbackFn: Function,
    className?: string
}

const FileSelect: React.FC<FileSelectProps> = ({
    callbackFn,
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
                accept=".wav,.mp3"
                onChange = {
                    (e: SyntheticEvent) => {
                        let files: FileList | null = (e.target as HTMLInputElement).files;

                        if (files && Array.from(files).length > 0) {
                            callbackFn(files[0]);
                        }
                    }
                }
                onClick = {
                    (e: SyntheticEvent) => {
                        (e.target as HTMLInputElement).value = "";
                    }
                }
            />
        </>
    )
}

export default FileSelect;