import React, { MutableRefObject, RefObject, useContext, useEffect, useRef, useState } from "react";
import { AudioFileWithCustom, SFXPack } from "../../types";
import { ReactComponent as MusicIcon } from "./../../assets/shared/music-icon-w-32px.svg";
import { ReactComponent as FileIcon } from "./../../assets/shared/file-icon-w-32px.svg";
import { SFXItemsContext } from "../../context/SFXItems";
import FileSelect from "./fileSelect";
import { downloadCustomSFX, fileSizeToString, playAudio } from "../../util/helpers";
import ReplacementTrack from "./replacementTrack";

interface TrackProps {
    f: AudioFileWithCustom,
    currentPack: SFXPack
}

const Track: React.FC<TrackProps> = ({
    f,
    currentPack
}) => {
    let { dispatch } = useContext(SFXItemsContext);

    return (
        <div
            key={f.fileName}
            className="sfx-pack-track"
        >
            <div className="sfx-pack-track-top">
                <div className="details">
                    <header className="default-name">
                        <FileIcon className="file-icon" /> {f.fileName}
                    </header>
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

                    <FileSelect
                        callbackFn={
                            (file: File[]) => {
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
                </div>
            </div>
            {(f.replacement) &&
                    <div className="replacements-list">
                        {
                            f.replacement.map(
                                (r: typeof f.replacement[0]) => (
                                    <ReplacementTrack
                                        key={r.name}
                                        replacementTrack = {r}
                                        trackName = {f.fileName}
                                        trackFormat = {f.format}
                                    />
                                )
                            )
                        }
                    </div>
                }
        </div>
    );
}

export default Track;