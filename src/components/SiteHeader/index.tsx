import "./styles.scss"
import { ReactComponent as Logomark180px} from "./logomark-w-180px.svg";
import { ReactComponent as DownloadIcon } from "./../../assets/shared/download-icon-w-32px.svg";
import { ReactComponent as MusicIcon } from "./../../assets/shared/music-icon-w-32px.svg";
import { ReactComponent as FileIcon } from "./../../assets/shared/file-icon-w-32px.svg";

const SiteHeader = () => {
    return (
        <nav className="site-header">
            <div className="logo">
                <Logomark180px />
            </div>
            
            <div className="inner">
                <h2 className="heading-1">Customize Your Steam Deck's Sound FX</h2>

                <div className="boxes">
                    <div className="box">
                        <div className="top-button-wrapper">
                            <div className="top-button">
                                <MusicIcon />
                                <div className="bar"></div>
                            </div>
                        </div>
                        <div className="text">
                            <header>Preview</header>
                            <h2>Default SFX</h2>
                        </div>
                    </div>
                    <div className="box">
                        <div className="top-button-wrapper">
                            <div className="top-button">
                                <FileIcon />
                                <div className="bar"></div>
                            </div>
                        </div>
                        <div className="text">
                            <header>Select</header>
                            <h2>a Custom FX File</h2>
                        </div>
                    </div>
                    <div className="box">
                        <div className="top-button-wrapper">
                            <div className="top-button">
                                <DownloadIcon />
                                <div className="bar"></div>
                            </div>
                        </div>
                        <div className="text">
                            <header>Download</header>
                            <h2>Your Deck-Ready SFX</h2>
                        </div>
                    </div>
                </div>

                <div className="links">
                    <h3>Required</h3>
                    <a href="https://github.com/SteamDeckHomebrew/decky-loader" target="_blank" rel="noopener noreferrer">
                        Decky Loader
                    </a>
                    <a href="https://github.com/EMERALD0874/SDH-AudioLoader" target="_blank" rel="noopener noreferrer">
                        Audio Loader
                    </a>
                </div>

                <small>
                    <strong>NOTE:</strong> We are not affiliated with the Decky Loader or Audio Loader projects. All credits go to their respective owners.
                </small>
            </div>
        </nav>
    );
}
 
export default SiteHeader;