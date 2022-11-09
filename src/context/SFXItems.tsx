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
        format: "mp3"
    }]
})

let defaultSFXPack: Function = (id?:string, packJSON?: PackJSON) => ({
    id: id ?? uuidv4(),
    packJSON: packJSON ?? defaultPackJSON,
    files: (Files as AudioFile[]).map((f: AudioFile) => { return { ...f, replacement: null } })
});

export type Action = {
    type: 'ADD_REPLACEMENT',
    payload: {
        fileName: string,
        file: File | null
    }
} | {
    type: 'ADD_SFX_PACK',
    payload: Pick<PackJSON, "name" | "author" | "description" | "music"> | null
} | {
    type: 'DELETE_REPLACEMENT',
    payload: string
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
            
            let file = packs[index].files[itemIndex];
            file.replacement = action.payload.file;

            return {
                ...state,
                sfxPacks: [...packs]
            }
        case 'DELETE_REPLACEMENT': {
            let packs = [...state.sfxPacks];
            let index = packs.findIndex((p: SFXPack) => p.id === state.currentId)

            if (index === -1) return state;

            let itemIndex = packs[index].files.findIndex((f: AudioFileWithCustom) => f.fileName === action.payload)
            
            if (itemIndex === -1) return state;

            packs[index].files[itemIndex].replacement = null;

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
                Array.from(action.payload).map(
                    (nf: File | null) => {
                        packs[index].files.map(
                            (f: AudioFileWithCustom) => {
                                if (f.fileName === nf?.name)
                                    f.replacement = nf;
                            }
                        );
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