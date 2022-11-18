import { SyntheticEvent } from "react";

export const handleClickableElement = (
    e: SyntheticEvent, 
    callbackFn: Function
): void => {
    if ( e instanceof KeyboardEvent 
        && e.key !== "Enter" 
        && e.key !== " "
    ) return;
    
    callbackFn();
} 