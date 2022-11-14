import "./styles.scss";
import { ReactComponent as GithubIcon } from "./../../assets/shared/iconmonstr-github-4.svg";
import { ReactComponent as RedditIcon } from "./../../assets/shared/iconmonstr-reddit-4.svg";

const SiteFooter = () => {
    return (
        <footer className="site-footer">
            <div className="inner">
                <div className="links">
                    <b>Social</b>
                    <a
                        href="https://reddit.com/u/jM5557"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-icon-only"
                    >
                        <RedditIcon
                            fill="#FFF"
                            style={{
                                width: "36px",
                                height: "36px"
                            }}
                        />
                        <span>
                            Contact Me on Reddit
                        </span>
                    </a>
                    <a 
                        href="https://github.com/jM5557/SDeckFX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-icon-only"
                    >
                        <GithubIcon
                            fill="#FFF"
                            style={{
                                width: "36px",
                                height: "36px"
                            }}
                        />
                        <span>Check us out on GitHub</span>
                    </a>
                </div>
                <small className="notice">
                    SDeckFX is not affiliated with Valve Corp. nor owns any copyrighted material included on this site.
                </small>
            </div>
        </footer>
    );
}

export default SiteFooter;