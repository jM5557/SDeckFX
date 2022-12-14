import { RefObject, SyntheticEvent, useContext, useEffect, useRef } from "react";
import { SFXItemsContext } from "../../context/SFXItems";
import { PackJSON } from "../../types";
import { loadPackJSON } from "../../util/helpers";
import { ReactComponent as FolderIcon } from "./../../assets/shared/folder-icon-w-32px.svg";

interface FolderSelectProps {
    className?: string,
    isNewPack?: boolean
    format?: string
}
 
const FolderSelect: React.FC<FolderSelectProps> = ({
    className,
    isNewPack,
    format
}) => {
    const { dispatch } = useContext(SFXItemsContext);

    const ref: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    
    useEffect(
        () => {
            if (ref.current) {
                ref.current.setAttribute("webkitdirectory", "");
                ref.current.setAttribute("directory", "");
            }
        },
        []
    )

    return (
        <>
            <button
                type="button"
                onClick={
                    () => {
                        if (ref.current) {
                            ref.current.click();
                        }
                    }
                }
                className={ `${ className ?? "" }` }
            >
                <FolderIcon />
                <span>Import</span> 
                { format && <b>{ format }</b> }
            </button>
            <input
                type = "file"
                onChange = {
                    async (e: SyntheticEvent) => {
                        let files: FileList | null = (e.target as HTMLInputElement).files;

                        if (files) {
                            if (isNewPack) {
                                let packJSON: PackJSON | null = await loadPackJSON(files);

                                dispatch({
                                    type: "ADD_SFX_PACK",
                                    payload: (packJSON) 
                                        ? {
                                            name: packJSON.name,
                                            description: packJSON.description,
                                            author: packJSON.author,
                                            music: packJSON.music,
                                            mappings: packJSON.mappings
                                        }
                                        : null
                                });
                            }

                            dispatch({
                                type: "SET_ALL_REPLACEMENTS",
                                payload: Array.from(files)
                            });
                        }
                    }
                }
                onClick = {
                    (e: SyntheticEvent) => {
                        (e.target as HTMLInputElement).value = "";
                    }
                }

                style = {{display: "none"}}
                ref = { ref }
            />
        </>
    );
}
 
export default FolderSelect;