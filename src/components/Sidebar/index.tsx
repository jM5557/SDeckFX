import { useContext, useState } from "react";
import { SFXItemsContext } from "../../context/SFXItems";
import { SFXPack } from "../../types";
import JSONForm from "../JSONForm";
import FolderSelect from "../SFXPack/folderSelect";
import Preview from "../SFXPack/preview";
import "./styles.scss";

interface SidebarProps {
    ImportButton: JSX.Element,
    CreateButton: JSX.Element
}
 
const Sidebar: React.FC<SidebarProps> = ({
    ImportButton,
    CreateButton
}) => {
    let  { state } = useContext(SFXItemsContext);
    
    return (
        <aside className="sidebar">
            <div className="action-btns">
                { ImportButton }
                { CreateButton }
            </div>

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