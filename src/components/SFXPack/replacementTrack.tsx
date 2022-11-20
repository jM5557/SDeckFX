import React, { MutableRefObject, RefObject, SyntheticEvent, useCallback, useContext, useEffect, useRef, useState } from "react";
import { downloadCustomSFX, fileSizeToString, formatSeconds } from "../../util/helpers";
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
    let interval: MutableRefObject<NodeJS.Timer | null> = useRef<NodeJS.Timer | null>(null);
    let seeker: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    let thumb: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<string>("00:00");
    const [seekTime, setSeekTime] = useState<number>(0);

    const { dispatch } = useContext(SFXItemsContext);

    useEffect(() => {
        if (!audio.current)
            loadAudio(replacementTrack);
        
        return () => {
            if (audio.current)
                audio.current.pause();
            audio.current = null;
            setIsPlaying(false);
            
            if (interval.current) {
                clearInterval(interval.current);
                interval.current = null;
            }
        }
    }, [])

    const loadAudio = (file: File | null) => {
        if (file) {
            let fr: FileReader = new FileReader();
            fr.readAsDataURL(file);
    
            let blob: Blob = new Blob([file], { type: `application/${ trackFormat }` });
            let url: string = window.URL.createObjectURL(blob);

            let tempAudio = new Audio(url);
            
            // once playback ends
            tempAudio.onended = () => {
                setIsPlaying(false);

                // reset all progress
                if (audio.current) {
                    setProgress(0);
                    setCurrentTime("00:00");
                    
                    if (interval.current)
                        clearInterval(interval.current);
                    
                    interval.current = null;
                    
                    setSeekTime(0);
                    if (thumb.current)
                        thumb.current.style.left = "0%"
                }
            }
            
            audio.current = tempAudio;
        }
        else {
            audio.current = null;
        }
    }

    const playAudio = () => {
        if (!interval.current)
            interval.current = setInterval(() => {
                if (audio.current && audio.current.duration > 0) {
                    setProgress(Math.floor(
                        (audio.current.currentTime / audio.current.duration) 
                            * 100
                    ))
                    setCurrentTime(formatSeconds(audio.current.currentTime))
                }
            }, 100);

        if (audio.current) {
            if (audio.current.paused) {
                audio.current.play();
                setIsPlaying(true);
            } else {
                audio.current.pause();
                setIsPlaying(false);

                if (interval.current) {
                    clearInterval(interval.current);
                    interval.current = null;
                }
            }
        }
    }

    let handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (seeker.current) {
            let seekPerc = seekTime;

            // get mouse offsetX on mobile
            if (e.hasOwnProperty('touches')) {
                let event = e as React.TouchEvent<HTMLDivElement>;
                let rect = (e.target as HTMLDivElement).getBoundingClientRect();
                let offsetX = event.touches[0].clientX 
                    - window.scrollX 
                    - rect.left;

                seekPerc = Math.floor(offsetX / seeker.current.clientWidth * 100);
            }
            else {
                seekPerc = Math.floor(
                    (e as React.MouseEvent<HTMLDivElement>)
                        .nativeEvent
                        .offsetX
                    / seeker.current.clientWidth 
                    * 100
                );
            }

            if (seekPerc !== seekTime) {
                setSeekTime(seekPerc);
    
                if (thumb.current) {
                    thumb.current.style.left = `${seekPerc}%`;

                    // adjustment so mouse sits in middle of thumb
                    thumb.current.style.left = `calc(${seekPerc}% - ${ thumb.current.clientWidth / 2 }px)`;
                }
            }
        }
    };

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
                        { (audio.current) &&
                            <span className="replacement-detail replacement-progress-bar">
                                <span>
                                    {`${currentTime} : ${ formatSeconds(audio.current.duration)}`}
                                </span>

                                <div 
                                    className="progress-bar-wrapper" 
                                    ref = { seeker }
                                    onMouseMove = { handleSeek }
                                    onTouchStart = { handleSeek }
                                    onClick = {
                                        () => {
                                            if (audio.current) {
                                                let updatedTime = Math.floor(
                                                    seekTime 
                                                    / 100 
                                                    * audio.current.duration
                                                );
                                                audio.current.currentTime = updatedTime;
                                                setCurrentTime(
                                                    formatSeconds(
                                                        audio.current.currentTime
                                                    )
                                                )
                                                
                                                setProgress(seekTime);
                                                
                                                if (!isPlaying)
                                                    playAudio();
                                            }
                                        }
                                    }
                                >
                                    <div 
                                        className="thumb"
                                        ref = { thumb }
                                    ></div>
                                    <div className="progress-bar"
                                        style = {{
                                            width: `${ progress }%`
                                        }}
                                    >
                                    </div>
                                </div>
                            </span>
                        }
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
                                audio?.current?.pause();
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