import "./styles.scss";

const SiteFooter = () => {
    return (
        <footer className="site-footer">
            <div className="inner">
                <div className="link">
                    <b>Have a Question or Feedback?</b>
                    <a href="https://reddit.com/u/jM5557" target="_blank" rel="noopener noreferrer">Contact Me on Reddit</a>
                </div>
                <div className="link">
                    <b>Checkout us out on...</b>
                    <a href="https://github.com/jM5557/SDeckFX" target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <small className="notice">
                    SDeckFX is not affiliated with Valve Corp. nor owns any copyrighted material included on this site.
                </small>
            </div>
        </footer>
    );
}
 
export default SiteFooter;