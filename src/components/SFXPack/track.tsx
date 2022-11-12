import React, { MutableRefObject, RefObject, useContext, useEffect, useRef, useState } from "react";
import { AudioFileWithCustom, SFXPack } from "../../types";
import { ReactComponent as MusicIcon } from "./../../assets/shared/music-icon-w-32px.svg";
import { ReactComponent as DownloadIcon } from "./../../assets/shared/download-icon-w-32px.svg";
import { ReactComponent as TrashIcon } from "./../../assets/shared/trash-icon-w-32px.svg";
import { ReactComponent as FileIcon } from "./../../assets/shared/file-icon-w-32px.svg";
import { SFXItemsContext } from "../../context/SFXItems";
import FileSelect from "./fileSelect";
import { downloadCustomSFX, fileSizeToString, playAudio } from "../../util/helpers";

interface TrackProps {
    f: AudioFileWithCustom,
    currentPack: SFXPack | undefined
}

const Track: React.FC<TrackProps> = ({
    f,
    currentPack
}) => {
    let { dispatch } = useContext(SFXItemsContext);

    let audio: MutableRefObject<HTMLAudioElement | null> = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (!audio.current && f.replacement) {
            loadAudio(f.replacement);
        }
        
        return () => {
            audio?.current?.pause();
            audio.current = null;
            setIsPlaying(false);
        }
    }, [])

    const loadAudio = (file: File | null) => {
        if (file) {
            let fr: FileReader = new FileReader();
            fr.readAsDataURL(file);
    
            let blob: Blob = new Blob([file], { type: `application/${ f.format }` });
            let url: string = window.URL.createObjectURL(blob);
            
            let tempAudio = new Audio(url);
            tempAudio.onended = () => {
                setIsPlaying(false);
            }
            
            audio.current = tempAudio;
        }
        else {
            audio.current = null;
        }
    }

    const playCustomAudio = () => {
        if (audio.current) {
            if (audio.current.paused) {
                audio.current.play();
                setIsPlaying(true);
            } else {
                audio.current.pause();
                setIsPlaying(false);
            }
        }

        console.log(isPlaying);
    }

    return (
        <div
            key={f.fileName}
            className="sfx-pack-track"
        >
            <div className="details">
                <header className="default-name">
                    <FileIcon className="file-icon" /> {f.fileName}
                </header>

                {(f.replacement) &&
                    <div className="replacement">
                        <div className="replacement-inner">
                            <div>
                                <b>Custom</b>
                                <div className="replacement-details">
                                    <span className="replacement-detail replacement-name">
                                        { f.replacement.name }
                                    </span>
                                    <span className="replacement-detail">
                                        { fileSizeToString(f.replacement.size) }
                                    </span>
                                </div>
                            </div>    
                            {(f.replacement) &&
                                <div className="replacement-buttons">
                                    <button
                                        onClick={() => playCustomAudio()}
                                        className={`button-icon-only ${ isPlaying ? "playing" : "" }`}
                                    >
                                        <MusicIcon />
                                        <span>Preview</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="button-icon-only download"
                                        onClick={() => {
                                            downloadCustomSFX(f.fileName, f.replacement as File, f.format)
                                        }}
                                    >
                                        <DownloadIcon />
                                        <span>Download Track</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={
                                            () => {
                                                audio.current = null;
                                                setIsPlaying(false);
                                                dispatch({
                                                    type: "DELETE_REPLACEMENT",
                                                    payload: f.fileName
                                                })
                                            }
                                        }
                                        className="button-icon-only"
                                    >
                                        <TrashIcon />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
            <div className="buttons">
                {(f.title.length > 0) &&
                    <button
                        onClick={() => playAudio(`./../../assets/audio/sounds/${f.fileName}`)}
                        className="button-icon-only audio"
                    >
                        <MusicIcon />
                        <span>Default</span>
                    </button>
                }

                {(currentPack && currentPack.packJSON) &&
                    <FileSelect
                        callbackFn={
                            (file: File) => {
                                loadAudio(file);
                                dispatch({
                                    type: 'ADD_REPLACEMENT',
                                    payload: {
                                        fileName: f.fileName,
                                        file
                                    }
                                })
                            }
                        }
                        isMusic={currentPack.packJSON.music}
                        className="browse-btn"
                    />
                }
            </div>
        </div>
    );
}

export default Track;