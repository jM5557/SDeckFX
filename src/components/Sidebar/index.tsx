import { RefObject, useContext, useEffect, useRef } from "react";
import { SFXItemsContext } from "../../context/SFXItems";
import { SFXPack } from "../../types";
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

    let ref: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    
    useEffect(
        () => {
            if (ref.current) {
                ref.current.scrollTop = ref.current.scrollHeight;
                ref.current.scrollLeft = ref.current.scrollWidth - ref.current.clientWidth;
                console.log(ref.current.scrollWidth, ref.current.clientWidth);
            }
        }, 
        [state.sfxPacks.length]
    )
    
    return (
        <aside className="sidebar">
            <div className="action-btns">
                { ImportButton }
                { CreateButton }
            </div>

            <div className="previews-list" ref = { ref }>
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