'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/types/quiz';
import QuestionView from './QuestionView';
import FeedbackView from './FeedbackView';
import ResultView from './ResultView';
import { saveIncorrectQuestionId, removeIncorrectQuestionId, getIncorrectQuestionIds } from '@/utils/storage';
import styles from './QuizGame.module.css';

interface QuizGameProps {
    questions: Question[];
    categoryName: string;
}

export default function QuizGame({ questions, categoryName }: QuizGameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isPreviouslyIncorrect, setIsPreviouslyIncorrect] = useState(false);
    const [isConfirmingFinish, setIsConfirmingFinish] = useState(false);
    const [shuffledState, setShuffledState] = useState<{ options: string[], mapping: number[] } | null>(null);

    const currentQuestion = questions[currentIndex];

    // Helper to shuffle options
    const shuffleOptions = (opts: string[]) => {
        const withIndex = opts.map((opt, i) => ({ opt, i }));
        // Fisher-Yates shuffle
        for (let i = withIndex.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [withIndex[i], withIndex[j]] = [withIndex[j], withIndex[i]];
        }
        return {
            options: withIndex.map(o => o.opt),
            mapping: withIndex.map(o => o.i)
        };
    };

    // Initialize/Update shuffled state and check incorrect status when question changes
    useEffect(() => {
        if (currentQuestion) {
            // Shuffle
            setShuffledState(shuffleOptions(currentQuestion.options));

            // Check incorrect status
            const ids = getIncorrectQuestionIds();
            setIsPreviouslyIncorrect(ids.includes(currentQuestion.id));
        }
    }, [currentQuestion]);

    const handleAnswer = (displayIndex: number) => {
        if (selectedOption !== null || !shuffledState) return;

        const originalIndex = shuffledState.mapping[displayIndex];
        setSelectedOption(displayIndex);

        if (originalIndex === currentQuestion.correctIndex) {
            setScore(s => s + 1);
            removeIncorrectQuestionId(currentQuestion.id);
        } else {
            saveIncorrectQuestionId(currentQuestion.id);
        }
        setShowFeedback(true);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setShuffledState(null);
        } else {
            setIsFinished(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setIsFinished(false);
        setIsConfirmingFinish(false); // Reset confirmation state
        setShuffledState(null);
    };

    const handleEarlyFinish = () => {
        setIsConfirmingFinish(true);
    };

    if (isFinished) {
        const questionsAttempted = selectedOption !== null ? currentIndex + 1 : currentIndex;
        return <ResultView score={score} total={questionsAttempted} onRestart={handleRestart} />;
    }

    if (!currentQuestion || !shuffledState) return <div className={styles.loading}>Loading...</div>;

    const correctDisplayIndex = shuffledState.mapping.indexOf(currentQuestion.correctIndex);
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className={styles.gameContainer}>
            {isConfirmingFinish && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Finish Quiz?</h3>
                        <p>Are you sure you want to finish the quiz now?</p>
                        <div className={styles.modalButtons}>
                            <button
                                className={`${styles.modalButton} ${styles.cancelButton}`}
                                onClick={() => setIsConfirmingFinish(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${styles.modalButton} ${styles.confirmButton}`}
                                onClick={() => setIsFinished(true)}
                            >
                                Finish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <span className={styles.categoryBadge}>{categoryName}</span>
                    <div className={styles.headerRight}>
                        <span className={styles.scoreBadge}>Score: {score}</span>
                        <button onClick={handleEarlyFinish} className={styles.finishButton}>
                            Finish
                        </button>
                    </div>
                </div>
                <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
                </div>
            </header>

            <main className={styles.main}>
                {isPreviouslyIncorrect && (
                    <div className={styles.incorrectBadge}>
                        ⚠️ 이전에 틀렸던 문제입니다!
                    </div>
                )}

                <QuestionView
                    question={{ ...currentQuestion, options: shuffledState.options }}
                    onAnswer={handleAnswer}
                    disabled={selectedOption !== null}
                    selectedOption={selectedOption}
                    correctOption={selectedOption !== null ? correctDisplayIndex : null}
                    currentNumber={currentIndex + 1}
                />

                {showFeedback && (
                    <FeedbackView
                        isCorrect={shuffledState.mapping[selectedOption!] === currentQuestion.correctIndex}
                        explanation={currentQuestion.explanation}
                        onNext={handleNext}
                        isLastQuestion={currentIndex === questions.length - 1}
                        questionId={currentQuestion.id}
                    />
                )}
            </main>
        </div>
    );
}
