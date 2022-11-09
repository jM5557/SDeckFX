import { useContext, useState } from "react";
import { SFXItemsContext } from "../../context/SFXItems";
import { SFXPack } from "../../types";
import JSONForm from "../JSONForm";
import Modal from "../Modal";
import FolderSelect from "../SFXPack/folderSelect";
import Preview from "../SFXPack/preview";
import "./styles.scss";

interface SidebarProps {}
 
const Sidebar: React.FC<SidebarProps> = () => {
    let  { state, dispatch } = useContext(SFXItemsContext);

    const [displayJSONForm, setDisplayJSONForm] = useState<boolean>(false);
    return (
        <aside className="sidebar">
            <div className="action-btns">
                <FolderSelect
                    className="button-icon"
                    isNewPack={ true }
                />
                <button 
                    className="button-icon download"
                    onClick={
                        () => setDisplayJSONForm(!displayJSONForm)
                    }
                >
                    Create
                </button>
            </div>
            
            { (displayJSONForm) &&
                <Modal
                    handleClose={ () => setDisplayJSONForm(false) }
                >
                    <div className="modal">
                        <header className="top">
                            <span>
                                Create a SFX Pack
                            </span>
                            <button
                                type = "button"
                                onClick={() => setDisplayJSONForm(false)}
                            >
                                Cancel
                            </button>
                        </header>
                        <JSONForm 
                            hideForm={() => setDisplayJSONForm(false)}
                        />
                    </div>
                </Modal>
            }

            <div className="previews-list">
                {
                    state.sfxPacks.map((p: SFXPack) => (
                        <Preview
                            key = {p.id}
                            id = {p.id}
                            packJSON = {p.packJSON}
                        />
                    ))
                }
            </div>
        </aside>
    );
}
 
export default Sidebar;