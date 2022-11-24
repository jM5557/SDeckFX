import "./app.scss";
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { useEffect, useRef, SyntheticEvent, useContext, useState, useMemo, useCallback } from 'react';
import { SFXItemsContext, SFXItemsProvider } from './context/SFXItems';
import Sidebar from './components/Sidebar';
import SFXPack from './components/SFXPack';
import Modal from "./components/Modal";
import JSONForm from "./components/JSONForm";
import FolderSelect from "./components/SFXPack/folderSelect";
import { ReactComponent as AddIcon } from "./assets/shared/add-icon-w-32px.svg";

const AppBody = () => {
  let { state, dispatch } = useContext(SFXItemsContext);
  const [displayForm, setDisplayForm] = useState<boolean>(false);

  const CreateButton = useCallback((
    className: string = "button-icon download"
  ) => (
    <button
      type="button"
      className={className}
      onClick={
        () => setDisplayForm(!displayForm)
      }
    >
      <AddIcon />
      <span>
        Create
      </span>
    </button>
  ), []);

  const ImportButton = useCallback((className: string = "button-icon") => (
    <FolderSelect
      className={className}
      isNewPack={true}
    />
  ), []);

  const InnerContent = useCallback(() => {
    if (state.sfxPacks.length > 0)
      return (
        <div className="editor">
          <Sidebar
            ImportButton={ImportButton()}
            CreateButton={CreateButton()}
          />
          <section className="editor-body">
            <SFXPack />
          </section>
        </div>
      );
    else return (
      <div className="no-editor">
        <div className="no-editor-body-wrapper">
          <img alt = "logo" src = "/assets/logomark-color.png" />
          <div className="no-editor-body">
            <h2>Get Started</h2>
            <header>
              Customize your Steam Deck's UI SFX & Music
            </header>
            <div className="cta-wrapper">
              {CreateButton("cta download")}
              {ImportButton("cta")}
            </div>
            <small>
              To import, your folder must contain a valid configuration file (pack.json).
                <br/>
              Check the requirements above to learn more.
            </small>
          </div>
        </div>
      </div>
    )
  }, [state]);

  const CreateModal = useMemo(() => (
    <Modal
      handleClose={() => setDisplayForm(false)}
    >
      <div className="modal">
        <header className="top">
          <span>
            Create a SFX Pack
          </span>
          <button
            type="button"
            onClick={() => setDisplayForm(false)}
          >
            Cancel
          </button>
        </header>
        <JSONForm
          hideForm={() => setDisplayForm(false)}
          formType="CREATE"
        />
      </div>
    </Modal>
  ), []);

  return (
    <>
      {InnerContent()}

      {(displayForm) && (CreateModal)}
    </>
  )
}

function App() {
  return (
    <div className="body">
      <SiteHeader />
      <main>
        <SFXItemsProvider>
          <AppBody />
        </SFXItemsProvider>
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
