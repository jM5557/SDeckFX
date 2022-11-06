import AudioItem from './components/AudioItem'
import { AudioFileWithCustom } from './types';
import "./app.scss";
import SiteHeader from './components/SiteHeader';
import JSONForm from './components/JSONForm';
import SiteFooter from './components/SiteFooter';
import { useEffect, useRef, SyntheticEvent, useContext } from 'react';
import { SFXItemsProvider } from './context/SFXItems';
import Sidebar from './components/Sidebar';
import SFXPack from './components/SFXPack';

function App() {
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
        <SFXItemsProvider>
          <div className="editor">
            <Sidebar />
            <section className="editor-body">
              <SFXPack />
            </section>
          </div>
        </SFXItemsProvider>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
