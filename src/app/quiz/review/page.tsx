'use client';

import { useState, useEffect } from 'react';
import { getQuestionsByIds } from '@/app/actions';
import { getIncorrectQuestionIds } from '@/utils/storage';
import QuizGame from '@/components/QuizGame';
import { Question } from '@/types/quiz';
import Link from 'next/link';

export default function ReviewPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadQuestions = async () => {
            const ids = getIncorrectQuestionIds();
            if (ids.length > 0) {
                const fetchedQuestions = await getQuestionsByIds(ids);
                setQuestions(fetchedQuestions);
            }
            setLoading(false);
        };
        loadQuestions();
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                Loading review questions...
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#666',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center'
            }}>
                <h1>틀린 문제가 없습니다</h1>
                <p>대단해요! 틀린 문제가 없거나 이미 모두 복습했습니다.</p>
                <Link href="/" style={{
                    padding: '10px 20px',
                    backgroundColor: '#6200ea',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none'
                }}>
                    메인으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Link href="/" style={{
                display: 'inline-block',
                marginBottom: '20px',
                color: '#666',
                textDecoration: 'none'
            }}>
                &larr; Exit Review
            </Link>
            <QuizGame questions={questions} categoryName="Review Mode (Incorrect Answers)" />
        </div>
    );
}
