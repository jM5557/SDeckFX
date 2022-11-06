import { useEffect, useRef } from "react";

const useModal = (id: string) => {
    const rootElemRef = useRef(document.createElement('div'));
  
    useEffect(
        () => {
            const parentElem: Element | null = document.getElementById(id);
            parentElem?.appendChild(rootElemRef.current);

            return () => {
                rootElemRef.current.remove();
            };
        }, 
        [id]
    );
  
    return rootElemRef.current;
}

export default useModal;