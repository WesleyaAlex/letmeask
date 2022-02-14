import { useState, useEffect } from "react";
import { ref, database, onValue } from '../services/firebase'
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>;
}>

export function useRoom(roomId: string | undefined) {
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [questions, setQuestions] = useState<QuestionType[]>([])

    useEffect(() => {
        return onValue(ref(database, `rooms/${roomId}`), snapchot => {
            const room = snapchot.val()
            const firebaseQuestions: FirebaseQuestions = room.questions ?? {}
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id:key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId == user?.id)?.[0]
                }
            })

            setTitle(room.title)
            setQuestions(parsedQuestions)
        })
    }, [roomId, user?.id])

    return {
        questions,
        title
    }
}