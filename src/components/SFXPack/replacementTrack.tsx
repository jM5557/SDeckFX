import { MutableRefObject, useContext, useEffect, useRef, useState } from "react";
import { downloadCustomSFX, fileSizeToString } from "../../util/helpers";
import { ReactComponent as DownloadIcon } from "./../../assets/shared/download-icon-w-32px.svg";
import { ReactComponent as TrashIcon } from "./../../assets/shared/trash-icon-w-32px.svg";
import { ReactComponent as MusicIcon } from "./../../assets/shared/music-icon-w-32px.svg";
import { SFXItemsContext } from "../../context/SFXItems";

interface ReplacementTrackProps {
    replacementTrack: File,
    trackName: string,
    trackFormat: string
}

const ReplacementTrack: React.FC<ReplacementTrackProps> = ({
    replacementTrack,
    trackName,
    trackFormat
}) => {
    let audio: MutableRefObject<HTMLAudioElement | null> = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const { dispatch } = useContext(SFXItemsContext);

    useEffect(() => {
        if (!audio.current) {
            loadAudio(replacementTrack);
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
    
            let blob: Blob = new Blob([file], { type: `application/${ trackFormat }` });
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

    const playAudio = () => {
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
        <div className="replacement">
            <div className="replacement-inner">
                <div>
                    <b>Custom</b>
                    <div className="replacement-details">
                        <span className="replacement-detail replacement-name">
                            {replacementTrack.name}
                        </span>
                        <span className="replacement-detail">
                            {fileSizeToString(replacementTrack.size)}
                        </span>
                    </div>
                </div>
                <div className="replacement-buttons">
                    <button
                        onClick={() => playAudio()}
                        className={`button-icon-only ${isPlaying ? "playing" : ""}`}
                    >
                        <MusicIcon />
                        <span>Preview</span>
                    </button>

                    <button
                        type="button"
                        className="button-icon-only download"
                        onClick={() => {
                            downloadCustomSFX(trackName, replacementTrack, trackFormat)
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
                                    payload: {
                                        track: trackName,
                                        replacementTrack: replacementTrack.name
                                    }
                                })
                            }
                        }
                        className="button-icon-only"
                    >
                        <TrashIcon />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReplacementTrack;