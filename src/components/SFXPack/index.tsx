import { useContext, useState } from "react";
import { SFXItemsContext } from "../../context/SFXItems";
import { AudioFileWithCustom, SFXPack as SFXPackProps } from "../../types";
import { generatePackZip, generatePackZipMusicOnly, playAudio } from "../../util/helpers";
import FileSelect from "./fileSelect";
import { ReactComponent as MusicIcon } from "./../../assets/shared/music-icon-w-32px.svg";
import { ReactComponent as DownloadIcon } from "./../../assets/shared/download-icon-w-32px.svg";
import { ReactComponent as TrashIcon } from "./../../assets/shared/trash-icon-w-32px.svg";
import { ReactComponent as FileIcon } from "./../../assets/shared/file-icon-w-32px.svg";
import FolderSelect from "./folderSelect";
import Modal from "../Modal";

 
const SFXPack: React.FC = (): JSX.Element => {
    let { state, dispatch } = useContext(SFXItemsContext);
    const [displayDownloads, setDisplayDownloads] = useState<boolean>(false);

    let currentPack = state.sfxPacks.find((f: SFXPackProps) => f.id === state.currentId);

    if (!currentPack || typeof currentPack === undefined)
        return (<div className="empty">Select a SFX Pack to Edit</div>);

    return (
        <div className="sfx-pack">
            <div className="top">
                <header className="sfx-pack-name">
                    { currentPack.packJSON.name }
                </header>
                <div className="top-inner x-start">
                    <span className="sfx-pack-author">
                        Created by { currentPack.packJSON.author }
                    </span>
                    <span className="sfx-pack-count">
                        <b>Custom Tracks</b> { currentPack.files.filter((f: AudioFileWithCustom) => f.replacement !== null).length }
                    </span>
                </div>
                <div className="bottom-row">
                    <div className="sfx-pack-description">
                        <b>Description</b>
                        { currentPack.packJSON.description }
                    </div>
                    <div className="buttons">
                        <FolderSelect 
                            className="button-icon import"
                        />

                        { (currentPack.files.filter((f: AudioFileWithCustom) => f.replacement !== null).length > 0) &&
                            <button
                                type="button"
                                onClick={() => dispatch({
                                    type: 'CLEAR_ALL_REPLACEMENTS',
                                    payload: null
                                })}
                                className="button-icon clear-all"
                            >
                                Clear All
                            </button>
                        }
                        <button
                            type = "button"
                            onClick={
                                () => {
                                    setDisplayDownloads(true)
                                }
                            }
                            className="button-icon download"
                        >
                            <DownloadIcon />
                            <span>Download</span>
                        </button>
                    </div>
                </div>
            </div>
            { (displayDownloads) &&
                <Modal>
                    <div className="modal downloads">
                        <header className="top">
                            <span>Download SFX Pack</span>
                            <button
                                type = "button"
                                onClick={ () => setDisplayDownloads(false) }
                            >Cancel</button>
                        </header>
                        <div className="inner-content">
                            <p>Choose what you would like to download. The SFX Pack will need to be placed in the folder at the path /home/deck/homebrew/sounds</p>
                            <div className="buttons">
                                <button
                                    type = "button"
                                    className="button-icon"
                                    onClick = {
                                        () => {
                                            if (currentPack) {
                                                generatePackZip(
                                                    currentPack.packJSON, 
                                                    currentPack.files
                                                );
                                            }
                                        }
                                    }
                                >
                                    <span>Complete SFX Pack</span>
                                    <DownloadIcon />
                                </button>
                                <button
                                    type = "button"
                                    className="button-icon"
                                    onClick = {
                                        () => {
                                            if (currentPack) {
                                                let data: string = `text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify(currentPack?.packJSON)) }`;
    
                                                let link = document.createElement("a");
                                                link.href = `data:${ data }`;
                                                link.download = 'pack.json';
                                                document.body.appendChild(link);
                                                link.click();
                                                link.remove();
                                            }
                                        }
                                    }
                                >
                                    <span>Pack.json Only</span>
                                    <DownloadIcon />
                                </button>
                                <button
                                    type = "button"
                                    className="button-icon"
                                    onClick = {
                                        () => {
                                            if (currentPack)
                                                generatePackZipMusicOnly(currentPack.files)
                                        }
                                    }
                                >
                                    <span>Custom SFX Only</span>
                                    <DownloadIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            }
            { (currentPack.files.length > 0) &&
                <div className="sfx-pack-files">
                    {
                        currentPack.files.map((f: AudioFileWithCustom) => (
                            <div
                                key = {f.fileName}
                                className = "sfx-pack-track"
                            >
                                <FileIcon className="file-icon" />
                                <div className="details">
                                    <header className="default-name">
                                        { f.fileName }
                                    </header>
                                    
                                    { (f.replacement) &&
                                        <p className="replacement">
                                            <b>Custom</b> { f.replacement.name }
                                        </p>
                                    }
                                </div>
                                <div className="buttons">
                                    <button
                                        onClick={() => playAudio(`./../../assets/audio/sounds/${f.fileName}`)}
                                        className="button-icon-only audio"
                                    >
                                        <MusicIcon />
                                        <span>Default</span>
                                    </button>

                                    { (f.replacement) &&
                                        <>
                                            <button
                                                onClick={() => playAudio(f.replacement as File)}
                                                className="button-icon-only audio custom"
                                            >
                                                <MusicIcon />
                                                <span>Custom</span>
                                            </button>

                                            <button
                                                type = "button"
                                                className="button-icon-only download"
                                                onClick={() => {}}
                                            >
                                                <DownloadIcon />
                                                <span>Download Track</span>
                                            </button>
                                        </>
                                    }
                                    
                                    <FileSelect 
                                        callbackFn={
                                            (file: File) => {
                                                dispatch({
                                                    type: 'ADD_REPLACEMENT',
                                                    payload: {
                                                        fileName: f.fileName,
                                                        file
                                                    }
                                                })
                                            }
                                        }
                                        className = "browse-btn"
                                    />

                                    { (f.replacement) &&
                                        <button
                                            type = "button"
                                            onClick={
                                                () => {
                                                    dispatch({
                                                        type: "DELETE_REPLACEMENT",
                                                        payload: f.fileName
                                                    })
                                                }
                                            }
                                            className = "button-icon-only"
                                        >
                                            <TrashIcon />
                                            <span>Delete</span>
                                        </button>
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    );
}
 
export default SFXPack;