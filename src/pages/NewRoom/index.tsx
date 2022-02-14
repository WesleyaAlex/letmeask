import { FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import { Button } from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'
import { database, ref, push } from '../../services/firebase'
import './newRoom.scss'

export function NewRoom() {
    const [newRoom, setNewRoom] = useState('')
    const { user } = useAuth()
    const navigations = useNavigate()

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()

        if (newRoom.trim() === '') {
            return
        }

        const firebaseRoom = push(ref(database, 'rooms'), {
            title: newRoom,
            authorId: user?.id
        })

        navigations(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="img-illustration" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="img-logo" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input type="text" placeholder='Nome da sala' value={newRoom} onChange={(e) => setNewRoom(e.target.value)} />
                        <Button type='submit'>Criar sala</Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}