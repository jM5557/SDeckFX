import { ReactNode, SyntheticEvent, useContext, useState } from "react";
import { PackJSON } from "./../../types/index";
import { ReactComponent as DownloadIcon } from "./../../assets/shared/download-icon-w-32px.svg";
import "./styles.scss";
import { defaultPackJSON, SFXItemsContext } from "../../context/SFXItems";

interface JSONFormProps {
    children?: ReactNode,
    hideForm?: Function
}

let defaultPackJSONSettings: PackJSON = {
    name: "My SFX Pack",
    description: "Custom SFX Pack created on SDeckFX.com",
    author: "N/A",
    version: "v1.0",
    manifest_version: 2,
    music: false,
    ignore: [],
    mappings: {}
}
const JSONForm: React.FC<JSONFormProps> = ({ children, hideForm }) => {
    const  { dispatch } = useContext(SFXItemsContext);

    const [packJSON, setPackJSON] = useState<PackJSON>(defaultPackJSONSettings)
    
    const handleDownload: Function = () => {
        let data: string = `text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify(packJSON)) }`;

        let link = document.createElement("a");
        link.href = `data:${ data }`;
        link.download = 'pack.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const handleSubmit = () => {
        dispatch({
            type: 'ADD_SFX_PACK',
            payload: {
                ...defaultPackJSON,
                name: packJSON.name.trim(),
                author: packJSON.author.trim(),
                description: packJSON.description.trim()
            }
        });

        setPackJSON(defaultPackJSON);
    }
    return (
        <div className="json-form">
            <form onSubmit={
                () => { handleSubmit() }
            }>
                <div className="inner-form">
                    <label htmlFor="name">
                        <b>Name</b>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            value = { packJSON.name }
                            onChange = {
                                (e: SyntheticEvent) => {
                                    setPackJSON({
                                        ...packJSON,
                                        name: (e.target as HTMLInputElement)
                                            .value
                                            .slice(0, 99)
                                    })
                                }
                            }
                        />
                    </label>
                    <label htmlFor="author">
                        <b>Author</b>
                        <input 
                            type="text" 
                            name="author" 
                            id="author"
                            value = { packJSON.author }
                            onChange = {
                                (e: SyntheticEvent) => {
                                    setPackJSON({
                                        ...packJSON,
                                        author: (e.target as HTMLInputElement)
                                            .value
                                            .slice(0, 99)
                                    })
                                }
                            }
                        />
                    </label>
                    <label htmlFor="description" className="description-textarea">
                        <b>Description</b>
                        <textarea
                            name="description" 
                            id="description"
                            value = { packJSON.description }
                            onChange = {
                                (e: SyntheticEvent) => {
                                    setPackJSON({
                                        ...packJSON,
                                        description: (e.target as HTMLInputElement)
                                            .value
                                            .trim()
                                            .slice(0, 240)
                                    })
                                }
                            }
                        />
                    </label>
                </div>

                { (packJSON.name.length > 0 
                    && packJSON.author.length > 0) &&

                    <div className="buttons">
                        <button 
                            type = "submit"
                            onClick={
                                (e: SyntheticEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    handleDownload();
                                }
                            }
                            className = "button-icon"
                        >
                            <DownloadIcon />
                            <span>Download</span>
                        </button>
                        <button 
                            type = "submit"
                            onClick={
                                (e: SyntheticEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    handleSubmit();

                                    if (hideForm) hideForm();
                                }
                            }
                            className = "button-icon download"
                        >
                            <span>Create</span>
                        </button>
                    </div>
                }                            
            </form>
        </div>
    );
}
 
export default JSONForm;