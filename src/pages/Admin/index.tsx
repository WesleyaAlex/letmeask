import { useState } from 'react'
import { useParams } from 'react-router-dom'
import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'
import { Button } from '../../components/Button'
import { Question } from '../../components/Question'
import { RoomCode } from '../../components/RoomCode'
import Modal from '../../components/Modal'
import { useRoom } from '../../hooks/useRoom'
import { database, ref, update } from '../../services/firebase'
import './admin.scss'
import { useModal } from '../../hooks/useModal'

type RoomParams = {
    id: string;
}

export function Admin() {
    const { modal, setModal } = useModal()
    const [questionId, setQuestionId] = useState('')
    const params = useParams<RoomParams>()
    const roomId = params.id
    const { questions, title } = useRoom(roomId)

    async function handleEndRoom() {
        setModal(
            {
                ...modal, 
                message: 'Tem certeza que você deseja encerrar esta sala?', 
                titleMessage: 'Encerrar sala', 
                isOpen: true 
            }
        )
    }

    async function handleDeleteQuestion(questionId: string) {
        setModal(
            {
                ...modal, 
                message: 'Tem certeza que você deseja excluir esta pergunta?', 
                titleMessage: 'Excluir pergunta', 
                isOpen: true 
            }
        )
        setQuestionId(questionId)
    }

    async function handleCheckQuestionAnswered(questionId: string) {
        await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
            isAnswered: true
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await update(ref(database, `rooms/${roomId}/questions/${questionId}`), {
            isHighlighted: true
        })
    }

    return (
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImg} alt="img-logo" />
                    <div className='content-buttons'>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main className='content'>
                <Modal modal={modal} setModal={setModal} questionId={questionId}/>

                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 &&
                        <span>{questions.length} pergunta(s)</span>
                    }
                </div>

                <div className="question-list">
                    {questions.map(question => (
                        <Question 
                            key={question.id} 
                            content={question.content} 
                            author={question.author} 
                            isAnswered={question.isAnswered} 
                            isHighlighted={question.isHighlighted}
                        >
                            {!question.isAnswered && (
                                <>
                                    <button type='button' onClick={() => handleCheckQuestionAnswered(question.id)}>
                                        <img src={checkImg} alt="img-check" />
                                    </button>
                                    <button type='button' onClick={() => handleHighlightQuestion(question.id)}>
                                        <img src={answerImg} alt="img-answer" />
                                    </button>
                                </>
                            )}
                            <button type='button' onClick={() => handleDeleteQuestion(question.id)}>
                                <img src={deleteImg} alt="img-delete" />
                            </button>
                        </Question>
                    ))}
                </div>
            </main>
        </div>
    )
}