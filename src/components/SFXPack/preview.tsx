import { useContext } from "react";
import { SFXItemsContext } from "../../context/SFXItems";
import { PackJSON, SFXPack } from "../../types";
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
            onClick = {
                () => {
                    dispatch({
                        type: 'SET_CURRENT_ID',
                        payload: id
                    })
                }
            }
        >
            <span className="pack-type">{ packJSON.music ? "UI Music" : "UI SFX"}</span>
            <header className="name">{ packJSON.name }</header>
            <small className="author">
                Created by { packJSON.author }
            </small>
            <div className="buttons">
                <button
                    type = "button"
                    onClick={
                        () => {
                            dispatch({
                                type: 'SET_CURRENT_ID',
                                payload: id
                            })
                        }
                    }
                    className = "view"
                >
                    View
                </button>
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
                    className="button-icon-only"
                >
                    <TrashIcon />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    )
}

export default Preview;