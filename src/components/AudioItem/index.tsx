import { RefObject, SyntheticEvent, useRef, useState } from "react";
import { AudioFile } from "../../types";
import { ReactComponent as DownloadIcon } from "./download-icon-w-32px.svg"
import { ReactComponent as PlayIcon } from "./play-icon-w-32px.svg"
import { ReactComponent as TrashIcon } from "./trash-icon-w-32px.svg"
import { ReactComponent as FileIcon } from "./file-icon-w-32px.svg"
import "./styles.scss";

interface AudioItemProps {
    audioFile: AudioFile
}

const AudioItem: React.FC<AudioItemProps> = ({
    audioFile
}) => {
    const [replacementFile, setReplacementFile] = useState<File | null>(null);
    const inputRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const playAudio: Function = () => {
        let audio: HTMLAudioElement = new Audio(`./../../assets/audio/sounds/${audioFile.fileName}`);
        audio.play();
    }

    return (
        <div className="audio-item" id={audioFile.fileName}>
            <div className="audio-item-details">
                <header>{audioFile.title}</header>
                <div className="file">
                    <FileIcon />
                    <p>
                    {audioFile.fileName} { replacementFile && <strong>{ replacementFile.name }</strong>}
                    </p>
                </div>
                <p className="description">{audioFile.description}</p>
            </div>
            <div className="buttons">
                <button
                    type="button"
                    onClick={() => playAudio()}
                    className="button-icon"
                >
                    <PlayIcon />
                    <span>Default</span>
                </button>
                { !replacementFile &&
                    <button 
                        type = "button"
                        onClick={
                            () => {
                                if (inputRef) inputRef.current?.click();
                            }
                        }
                        className="button-icon"
                    >
                        <FileIcon />
                        <span>Replace File</span>
                    </button>
                }
                <input
                    type="file"
                    id="file-upload"
                    onChange={
                        (e: SyntheticEvent) => {
                            let files: FileList | null = (e.target as HTMLInputElement).files;

                            setReplacementFile(files ? files[0] : null);
                        }
                    }
                    accept=".wav,.mp3"
                    ref={inputRef}
                />
                {replacementFile &&
                    <>
                        <button
                            type="button"
                            onClick={
                                () => {
                                    let fr: FileReader = new FileReader();
                                    fr.readAsDataURL(replacementFile);
                                    let blob: Blob = new Blob([replacementFile], { type: `application/${replacementFile.type}` });
                                    let url: string = window.URL.createObjectURL(blob);

                                    let audio: HTMLAudioElement = new Audio(url);
                                    audio.play();
                                }
                            }
                            className="button-icon"
                        >
                            <PlayIcon />
                            <span>Preview</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                let fr: FileReader = new FileReader();
                                fr.readAsDataURL(replacementFile);

                                let blob: Blob = new Blob([replacementFile], { type: "application/wav" });
                                let url: string = window.URL.createObjectURL(blob);

                                let link = document.createElement("a");
                                link.href = url;
                                link.download = audioFile.fileName;
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                            }}
                            className="button-icon download"
                        >
                            <DownloadIcon />
                            <span>Download</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setReplacementFile(null);
                                if (inputRef && inputRef.current)
                                    inputRef.current.value = "";
                            }}
                            className="button-icon-only"
                        >
                            <TrashIcon />
                            <span>Delete</span>
                        </button>
                    </>
                }
            </div>
        </div>
    );
}

export default AudioItem;