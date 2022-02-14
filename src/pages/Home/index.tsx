import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import googleIconImg from '../../assets/images/google-icon.svg'
import { Button } from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'
import { ref, database, get } from '../../services/firebase'
import './home.scss'

export function Home() {
    const [roomCode, setRoomCode] = useState('')
    const navigations = useNavigate()
    const { user, signInWithGoogle } = useAuth()

    async function handleCreateRoom() {
        if (!user) {
           await signInWithGoogle()
        }
        
        navigations('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if (roomCode.trim() === '') {
            return
        }

        const roomRef = get(ref(database, `rooms/${roomCode}`))
        if (!(await roomRef).exists()) {
            alert('Esta sala não existe!')
            return
        }

        if ((await roomRef).val().endedAt) {
            alert('Esta sala já foi encerrada.')
            return
        }

        navigations(`/rooms/${roomCode}`)
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
                    <button className='create-room' onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt="img-google" />
                        Crie sua sala com o Google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input type="text" placeholder='Digite o código da sala' value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
                        <Button type='submit'>Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}