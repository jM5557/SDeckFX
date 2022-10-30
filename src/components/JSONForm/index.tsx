import { SyntheticEvent, useState } from "react";
import { PackJSON } from "./../../types/index";
import { ReactComponent as DownloadIcon } from "./download-icon-w-32px.svg";
import "./styles.scss";

interface JSONFormProps {}

let defaultPackJSONSettings: PackJSON = {
    name: "Custom SFX Pack",
    description: "Custom SFX Pack created on SDeckFX.com",
    author: "N/A",
    version: "v1.0",
    manifest_version: 2,
    music: false,
    ignore: [],
    mappings: {}
}
const JSONForm: React.FC<JSONFormProps> = () => {
    const [packJSON, setPackJSON] = useState<PackJSON>(defaultPackJSONSettings)
    const handleSubmit: Function = () => {
        let data: string = `text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify(packJSON)) }`;

        let link = document.createElement("a");
        link.href = `data:${ data }`;
        link.download = 'pack.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    return (
        <div className="json-form">
            <form onSubmit={
                () => { handleSubmit() }
            }>
                <div className="inner-form">
                    <div>
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
                                                .trim()
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
                                                .trim()
                                                .slice(0, 99)
                                        })
                                    }
                                }
                            />
                        </label>
                    </div>
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

                <button 
                    type = "submit"
                    onClick={
                        (e: SyntheticEvent) => {
                            e.preventDefault();
                            e.stopPropagation();

                            handleSubmit();
                        }
                    }
                    className = "button-icon download"
                >
                    <DownloadIcon />
                    <span>Download</span>
                </button>
            </form>
        </div>
    );
}
 
export default JSONForm;