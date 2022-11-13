import { useContext, useState } from "react";
import { SFXItemsContext } from "../../context/SFXItems";
import { AudioFileWithCustom, SFXPack as SFXPackProps } from "../../types";
import { generatePackZip, generatePackZipMusicOnly, getPackJSON, initiateDownload } from "../../util/helpers";
import { ReactComponent as DownloadIcon } from "./../../assets/shared/download-icon-w-32px.svg";
import FolderSelect from "./folderSelect";
import Modal from "../Modal";
import Track from "./track";

 
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
                    <span>
                        { currentPack.packJSON.music ? "UI Music" : "UI SFX" }
                    </span>
                </header>
                <div className="top-inner x-start">
                    <span className="sfx-pack-author">
                        Created by { currentPack.packJSON.author }
                    </span>
                    <span className="sfx-pack-count">
                        <b>Custom Tracks</b> { 
                            currentPack.files.filter(
                                (f: AudioFileWithCustom) => f.replacement && f.replacement.length > 0
                            ).length
                        }
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
                                () => setDisplayDownloads(true)
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
                <Modal
                    handleClose={ () => setDisplayDownloads(false) }
                >
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
                                                let data: string = `text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify(getPackJSON(currentPack?.packJSON, currentPack.files))) }`;
                                                
                                                initiateDownload(`data:${ data }`, 'pack.json');
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
            { (currentPack && currentPack.files.length > 0) &&
                <div className="sfx-pack-files">
                    {
                        currentPack.files.map((f: AudioFileWithCustom) => (
                            <Track
                                key = { f.fileName }
                                f = { f }
                                currentPack = { currentPack as SFXPackProps }
                            />
                        ))
                    }
                </div>
            }
        </div>
    );
}
 
export default SFXPack;