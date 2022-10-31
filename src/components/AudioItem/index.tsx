import { RefObject, SyntheticEvent, useEffect, useRef, useState } from "react";
import { AudioFile, AudioFileWithReplacement } from "../../types";
import { ReactComponent as DownloadIcon } from "./download-icon-w-32px.svg"
import { ReactComponent as PlayIcon } from "./play-icon-w-32px.svg"
import { ReactComponent as TrashIcon } from "./trash-icon-w-32px.svg"
import { ReactComponent as FileIcon } from "./file-icon-w-32px.svg"
import "./styles.scss";

interface AudioItemProps {
    audioFile: AudioFileWithReplacement,
    updateReplacement: Function
}

const AudioItem: React.FC<AudioItemProps> = ({
    audioFile,
    updateReplacement
}) => {
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
                        {audioFile.fileName} { audioFile.replacement && <strong>{ audioFile.replacement.name }</strong>}
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
                { !audioFile.replacement &&
                    <button 
                        type = "button"
                        onClick={
                            () => {
                                if (inputRef) 
                                    inputRef.current?.click();
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

                            updateReplacement(files ? files[0] : null)
                            console.table(audioFile);
                        }
                    }
                    accept=".wav,.mp3"
                    ref={inputRef}
                />
                {audioFile.replacement &&
                    <>
                        <button
                            type="button"
                            onClick={
                                () => {
                                    if (audioFile.replacement) {
                                        let fr: FileReader = new FileReader();
                                        fr.readAsDataURL(audioFile.replacement);
                                        let blob: Blob = new Blob([audioFile.replacement], { type: `application/${audioFile.replacement.type}` });
                                        let url: string = window.URL.createObjectURL(blob);
    
                                        let audio: HTMLAudioElement = new Audio(url);
                                        audio.play();
                                    }
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
                                if (audioFile.replacement) {
                                    let fr: FileReader = new FileReader();
                                    fr.readAsDataURL(audioFile.replacement);
    
                                    let blob: Blob = new Blob([audioFile.replacement], { type: "application/wav" });
                                    let url: string = window.URL.createObjectURL(blob);
    
                                    let link = document.createElement("a");
                                    link.href = url;
                                    link.download = audioFile.fileName;
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                }
                            }}
                            className="button-icon download"
                        >
                            <DownloadIcon />
                            <span>Download</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                updateReplacement(null);
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