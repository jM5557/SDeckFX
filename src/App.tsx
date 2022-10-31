import AudioItem from './components/AudioItem'
import Files from "./data/files.json";
import { AudioFile, AudioFileWithReplacement } from './types';
import "./app.scss";
import SiteHeader from './components/SiteHeader';
import JSONForm from './components/JSONForm';
import SiteFooter from './components/SiteFooter';
import { useState, useEffect, useRef, SyntheticEvent } from 'react';
import useFiles from './hooks/useFiles';
import { file } from 'jszip';

function App() {
  const { 
    files,
    setFiles,
    handleClearAll,
    updateReplacement,
    containsReplacements,
    saveAsZip,
    zipStatus
  } = useFiles();

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute("directory", "");
      ref.current.setAttribute("webkitdirectory", "");
    }
  }, []);

  return (
    <div className="body">
      <SiteHeader />
      <main>
        <section className='panel audio-items'>
          <header>
            <span>
              SFX/Audio Files
            </span>

            <button
              onClick={
                () => ref.current?.click()
              }
              className="button-icon"
            >
              Import from Folder
            </button>
            <input
              type = "file"
              id = "folder-input"
              ref={ref}
              onChange={
                (e: SyntheticEvent) => {
                  let val: FileList | null = (e.target as HTMLInputElement).files;
                  let temp: typeof files = [...files];

                  if (val) {
                    Array.from(val).map((nf: File) => {
                      temp.map((f: typeof files[0]) => {
                        if (nf.name === f.fileName) {
                          f.replacement = nf;
                        }
                      })
                    })
                  }

                  setFiles(temp);
                }
              }
            />
          </header>
          { (containsReplacements) &&
            <nav className='top-nav'>
              <button
                type = "button"
                onClick={() => handleClearAll()}
                className = "clear-btn"
              >
                Clear All
              </button>

              <button 
                type = "button"
                onClick={
                  () => { 
                    if (zipStatus === "IDLE")
                      saveAsZip();
                  }
                }
                disabled={(zipStatus === "ZIPPING")}
                className={`button-icon download ${ (zipStatus === "ZIPPING") ? "zipping" : ""}`}
              >
                Download ZIP 
                <b>
                  { 
                    files.filter(
                      (f: typeof files[0]) => f.replacement !== null).length 
                  }
                </b>
              </button>
            </nav>
          }
          { files.map(
            (f: AudioFileWithReplacement, index: number) => (
              <AudioItem
                key={f.fileName}
                audioFile={f}
                updateReplacement={
                  (replacement: AudioFileWithReplacement["replacement"]) => 
                    updateReplacement(index, replacement)
                }
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
