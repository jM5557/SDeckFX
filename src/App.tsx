import AudioItem from './components/AudioItem'
import Files from "./data/files.json";
import { AudioFile } from './types';
import "./app.scss";
import SiteHeader from './components/SiteHeader';
import JSONForm from './components/JSONForm';
import SiteFooter from './components/SiteFooter';

function App() {
  return (
    <div className="body">
      <SiteHeader />
      <main>
        <section className='panel audio-items'>
          <header>SFX/Audio Files</header>
          { (Files as AudioFile[]).map(
            (f: AudioFile) => (
              <AudioItem
                key={f.fileName}
                audioFile={f}
              />
            ) 
          )}
        </section>
        <div className='banner json-form-banner'>
          <header>Add Your SFX Pack</header>
          <p>
            Use the form below to generate and download a pack.json file. 
            This file must be placed alongside your .wav SFX files inside your SFX Pack folder which must be placed inside the folder /home/deck/homebrew/sounds
              <br />
              <br />
            Once you've done so, reload your SFX packs by navigating to the following: 
              <br />
              <br />
            <strong>Audio Loader</strong> <strong>Settings</strong> <strong>Manage Packs</strong> <strong>Filter Installed</strong> <strong>Reload Packs</strong>
          </p>
        </div>
        <section className='panel json-form'>
          <header>Create a Pack.JSON</header>
          <JSONForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
