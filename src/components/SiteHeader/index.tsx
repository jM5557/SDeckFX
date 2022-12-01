import "./styles.scss"
import { ReactComponent as Logomark180px} from "./logomark-w-180px.svg";
import { ReactComponent as RequirementsIcon } from "./../../assets/shared/requirements-icon-w-32px.svg";
import Modal from "../Modal";
import { useState } from "react";

const SiteHeader = () => {
    const [displayRequirements, setDisplayRequirements] = useState<boolean>(false);
    return (
        <nav className="site-header">
            <div className="logo">
                <Logomark180px />
            </div>
            <button
                type = "button"
                onClick={
                    () => setDisplayRequirements(true)
                }
                className = "button-icon"
            >
                <RequirementsIcon />
                <span>
                    Requirements    
                </span>
            </button>

            { (displayRequirements) &&
                <Modal
                    handleClose={() => setDisplayRequirements(false) }
                >
                    <div className="modal installation">
                        <div className="top">
                            <header>
                                Requirements
                            </header>
                            <button
                                type = "button"
                                onClick={
                                    () => setDisplayRequirements(false)
                                }
                            >
                                Exit
                            </button>
                        </div>
                        <p>
                            Create or edit an SFX Pack, and then install it onto your Steam Deck with the REQUIRED Decky Loader and Audio Loader plug-ins.
                        </p>
                        <div className="links">
                            <a href="https://github.com/SteamDeckHomebrew/decky-loader" target="_blank" rel="noopener noreferrer">
                                Decky Loader
                            </a>
                            <a href="https://github.com/EMERALD0874/SDH-AudioLoader" target="_blank" rel="noopener noreferrer">
                                Audio Loader
                            </a>
                        </div>
                        <small>
                            SDeckFX has no affiliaton with the Decky Loader and Audio Loader projects. All credits go to their respective development teams.
                        </small>
                    </div>
                </Modal>
            }
        </nav>
    );
}
 
export default SiteHeader;