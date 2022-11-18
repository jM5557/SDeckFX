import { SyntheticEvent, useContext } from "react";
import { SFXItemsContext } from "../../context/SFXItems";
import { PackJSON, SFXPack } from "../../types";
import { handleClickableElement } from "../../util/keyboard";
import { ReactComponent as TrashIcon } from "./../../assets/shared/trash-icon-w-32px.svg";
import "./styles.scss";

type PreviewProps = {
    id: string,
    packJSON: PackJSON
}

export const Preview: React.FC<PreviewProps> = ({
    id,
    packJSON
}): JSX.Element => {
    let { state, dispatch } = useContext(SFXItemsContext);

    return (
        <div
            className = {`sfx-pack-preview 
                ${ state.currentId === id 
                    ? "selected" 
                    : "" 
                }`
            }
            tabIndex = { 0 }
            role="button"
            onKeyDown={
                (e: SyntheticEvent) => handleClickableElement(
                    e, 
                    () => {
                        dispatch({
                            type: 'SET_CURRENT_ID',
                            payload: id
                        })
                    }
                )
            }
            onClick = {
                () => {
                    dispatch({
                        type: 'SET_CURRENT_ID',
                        payload: id
                    })
                }
            }
        >
            <div className="top">
                <span className="pack-type">
                    { packJSON.music ? "UI Music" : "UI SFX"}
                </span>
                <button 
                    type = "button"
                    onClick={
                        () => {
                            dispatch({
                                type: 'DELETE_SFX_PACK',
                                payload: id
                            })
                        }
                    }
                    className="button-icon-only delete"
                >
                    <TrashIcon />
                    <span>Delete</span>
                </button>
            </div>
            <header className="name">{ packJSON.name }</header>
            <small className="author">
                Created by { packJSON.author }
            </small>
        </div>
    )
}

export default Preview;