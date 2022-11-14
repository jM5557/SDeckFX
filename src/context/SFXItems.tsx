import React, { createContext, useReducer } from "react";
import { AudioFile, AudioFileWithCustom, PackJSON, SFXPack } from "../types";
import Files from "./../data/files.json";
import { v4 as uuidv4 } from "uuid";

export const defaultPackJSON: PackJSON = {
    name: "My SFX Pack",
    description: "My Custom SFX Pack Created on SDeckFX.com",
    author: "N/A",
    version: "v1.0",
    manifest_version: 2,
    music: false,
    ignore: [],
    mappings: {}
};

let defaultMusicPack: Function = (id?:string, packJSON?: PackJSON) => ({
    id: id ?? uuidv4(),
    packJSON: {
        ...packJSON,
        music: true
    },
    files: [{ 
        title: "",
        description: "Background Music",
        fileName: "menu_music.mp3",
        format: "mp3",
        replacement: []
    }]
})

let defaultSFXPack: Function = (id?:string, packJSON?: PackJSON) => ({
    id: id ?? uuidv4(),
    packJSON: packJSON ?? defaultPackJSON,
    files: (Files as AudioFile[]).map((f: AudioFile) => { return { ...f, replacement: [] } })
});

export type Action = {
    type: 'ADD_REPLACEMENT',
    payload: {
        fileName: string,
        file: File[]
    }
} | {
    type: 'ADD_SFX_PACK',
    payload: Pick<PackJSON, "name" | "author" | "description" | "music" | "mappings"> | null
} | {
    type: 'DELETE_REPLACEMENT',
    payload: {
        track: string,
        replacementTrack: string
    }
} | {
    type: 'EDIT_SFX_PACK',
    payload: Pick<PackJSON, "name" | "author" | "description">
} | {
    type: 'DELETE_SFX_PACK',
    payload: string
} | {
    type: 'SET_ALL_REPLACEMENTS',
    payload: (File | null)[] | null
} | {
    type: 'CLEAR_ALL_REPLACEMENTS',
    payload: null
} | {
    type: 'SET_CURRENT_ID',
    payload: string
}

export type AppState = {
    sfxPacks: SFXPack[],
    currentId: string | null
}

let initialSFXPack = defaultSFXPack();
const initialState: AppState = {
    sfxPacks: [initialSFXPack],
    currentId: initialSFXPack.id
}

const reducer = (
    state: AppState,
    action: Action
): AppState => {
    switch (action.type) {
        case 'ADD_REPLACEMENT':
            let packs = [...state.sfxPacks];
            let index = packs.findIndex((p: SFXPack) => p.id === state.currentId)
            
            if (index === -1) return state;
            
            let itemIndex = packs[index].files.findIndex((f: AudioFileWithCustom) => f.fileName === action.payload.fileName)
            
            if (itemIndex === -1) return state;
            
            let replacement = packs[index].files[itemIndex].replacement;
            replacement = [...(replacement ?? []), ...action.payload.file];

            packs[index].files[itemIndex].replacement = replacement;

            return {
                ...state,
                sfxPacks: [...packs]
            }
        case 'DELETE_REPLACEMENT': {
            let packs = [...state.sfxPacks];
            let index = packs.findIndex((p: SFXPack) => p.id === state.currentId)

            if (index === -1) return state;

            let itemIndex = packs[index].files.findIndex((f: AudioFileWithCustom) => f.fileName === action.payload.track)
            
            if (itemIndex === -1) return state;

            let replacement = packs[index].files[itemIndex].replacement;
            if (replacement)
                replacement = replacement.filter(
                    (r: File) => {
                        return r.name !== action.payload.replacementTrack
                    }
                );
            packs[index].files[itemIndex].replacement = replacement;

            return {
                ...state,
                sfxPacks: [...packs]
            }
        }
        case 'ADD_SFX_PACK':
            let id: string = uuidv4();
            return {
                currentId: id,
                sfxPacks: [
                    ...state.sfxPacks,
                    (
                        (action.payload?.music) 
                            ? defaultMusicPack(id, action.payload)  
                            : defaultSFXPack(id, action.payload)
                    )
                ]
            }
        case 'EDIT_SFX_PACK': {
            let packs = [...state.sfxPacks];
            let index = packs.findIndex((p: SFXPack) => p.id === state.currentId)
            
            if (index === -1) return state;
            
            packs[index] = {
                ...packs[index],
                packJSON: {
                    ...packs[index].packJSON,
                    ...action.payload
                }
            }

            return {
                ...state,
                sfxPacks: packs
            }
        }
        case 'DELETE_SFX_PACK': {
            let packs = [...state.sfxPacks];
            let filteredPacks = packs.filter((p: SFXPack) => p.id !== action.payload)
            return {
                currentId: filteredPacks.length > 0 
                    ? filteredPacks[0].id 
                    : null,
                sfxPacks: filteredPacks
            }
        }
        case 'SET_CURRENT_ID': {
            return {
                ...state,
                currentId: action.payload
            }
        }
        case 'CLEAR_ALL_REPLACEMENTS': {
            let packs = [...state.sfxPacks];
            let index = packs.findIndex((p: SFXPack) => p.id === state.currentId);

            if (index === -1) return state;

            packs[index].files.map(
                (f: AudioFileWithCustom) => f.replacement = null
            );

            return {
                ...state,
                sfxPacks: [...packs]
            }
        }
        case 'SET_ALL_REPLACEMENTS': {
            let packs = [...state.sfxPacks];
            let index = packs.findIndex((p: SFXPack) => p.id === state.currentId)

            if (index === -1) return state;

            if (action.payload) {
                let { mappings } = packs[index].packJSON;
                
                packs[index].files = packs[index].files.map(
                    (t: AudioFileWithCustom) => {
                        let replacements: File[] = [];
                        
                        (action.payload ?? []).map(
                            (f: File | null) => {
                                if (f) {
                                    if (mappings.hasOwnProperty(t.fileName)) {
                                        mappings[t.fileName].map(
                                            (v: string) => {
                                                if (f.name === v) {
                                                    replacements.push(f);
                                                }
                                            }
                                        )
                                    } else {
                                        if (f.name === t.fileName) {
                                            replacements.push(f);
                                        }
                                    }
                                }
                            }
                        )

                        t.replacement = replacements;
                        return t;
                    }
                )
            }

            return {
                ...state,
                sfxPacks: [...packs]
            }
        }
        default:
            return state;
    }
}

interface SFXItemsContextProviderProps {
    children: React.ReactNode
}

export const SFXItemsContext = createContext<{
    state: AppState, 
    dispatch: React.Dispatch<Action>
}>({
    state: initialState,
    dispatch: () => {}
});

export const SFXItemsProvider = ({ children }: SFXItemsContextProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <SFXItemsContext.Provider value = {{ state, dispatch }}>
            { children }
        </SFXItemsContext.Provider>
    )
}