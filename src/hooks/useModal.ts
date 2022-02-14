import { useState } from "react";

export type ModalType = {
    isOpen: boolean;
    message: string;
    titleMessage: string;
}

export function useModal() {
    const [modal, setModal] = useState<ModalType>({isOpen: false, message: '', titleMessage: '' })

    return {
        modal, 
        setModal
    }
}