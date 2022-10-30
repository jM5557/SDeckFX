import "./styles.scss"
import { ReactComponent as Logomark180px} from "./logomark-w-180px.svg";

const SiteHeader = () => {
    return (
        <nav className="site-header">
            <div className="logo">
                <Logomark180px />
            </div>
            
            <div className="inner">
                <h1>Enhance Your Steam Deck Experience</h1>
                <h2>Customize SFX on your Steam Deck</h2>
                <p>
                    SDeckFX is a tool to help you customize your Steam Deck's SFX via the Audio Loader plugin for Decky. SDeckFX allows you to preview each default SFX file and then replace it with a new one of your choice (only .wav and .mp3 files are accepted)
                    <br />
                    <br />
                    Once you have Decky and Audio Loader setup, and you have downloaded your new SFX file, simply create a new folder for your custom SFX pack within the path /home/deck/homebrew/sounds and drop your new SFX file inside.
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
                    <strong>NOTE:</strong> We are not affiliated with the Decky Loader or Audio Loader projects. All credits go to their respective owners.
                </small>
            </div>
        </nav>
    );
}
 
export default SiteHeader;