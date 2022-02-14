import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import closeImg from '../../assets/images/close-modal.png'
import deleteImg from '../../assets/images/delete-modal.png'
import { database, ref, remove, update } from '../../services/firebase'
import { ModalType } from '../../hooks/useModal'
import './styles.scss'

interface ModalProps {
    modal: ModalType;
    setModal: React.Dispatch<React.SetStateAction<{
        isOpen: boolean;
        message: string;
        titleMessage: string;
    }>>;
    questionId: string;
}

type RoomParams = {
    id: string;
}

export default function Modal({ modal, setModal, questionId } : ModalProps) {
    const params = useParams<RoomParams>()
    const roomId = params.id
    const navigations = useNavigate()

    const verifyElementClicked = (e: any) => {
        if (e.target.id === 'container-modal') {
            setModal(
                {
                    ...modal, 
                    isOpen: false 
                }
            )
        }
    }

    async function handleModal(questionId: string) {
        if (modal.titleMessage === 'Excluir pergunta') {
            await remove(ref(database, `rooms/${roomId}/questions/${questionId}`))
            setModal(
                {
                    ...modal, 
                    isOpen: false 
                }
            )
        } else {
            await update(ref(database, `rooms/${roomId}`), {
                endedAt: new Date()
            })
            navigations('/')
        }
    }

    return (
        <div className={modal.isOpen ? 'container-modal open' : 'container-modal'} id='container-modal' onClick={verifyElementClicked}>
            <div className='modal' id='modal'>
                <div className='modal-image'>
                    <img src={modal.titleMessage === 'Excluir pergunta' ? deleteImg : closeImg} alt="img-modal" />
                </div>
                <h2>{modal.titleMessage}</h2>
                <p>{modal.message}</p>
                <div className='modal-buttons'>
                    <button type='button' className='cancel' onClick={() => setModal({...modal, isOpen: false })}>Cancelar</button>
                    <button type='button' className='finish' onClick={() => handleModal(questionId)}>Sim, {modal.titleMessage === 'Excluir pergunta' ? 'excluir' : 'encerrar'}</button>
                </div>
            </div>
        </div>
    );
}