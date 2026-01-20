'use client';

import { useState } from 'react';
import { Question } from '@/types/quiz';
import QuestionView from './QuestionView';
import FeedbackView from './FeedbackView';
import ResultView from './ResultView';
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

    // Shuffled state for the current question
    // const [shuffledState, setShuffledState] = useState<{ options: string[], mapping: number[] } | null>(null);
    // Duplicate removed.

    // Actually lines 22-23 were:
    // // Shuffled state for the current question
    // const [shuffledState, setShuffledState] = useState<{ options: string[], mapping: number[] } | null>(null);

    // And lines 71-72 were:
    // // State for the *current question's* shuffled options
    // const [shuffledState, setShuffledState] = useState<{ options: string[], mapping: number[] } | null>(null);

    // I need to remove one of them. Let's remove the first one.

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

    // Effect to update shuffled data when question changes
    // Imports at top? No, inside component.

    // Actually, let's keep it simple. 
    // We can just shuffle options when we set CurrentIndex, but we need to store it.

    // Let's restart:
    // We need to maintain the "current shuffled state" for the question.
    // If we only shuffle on render, it will change on re-renders.

    // Let's modify the component structure slightly.
    /*
      Instead of complex state, let's memoize the shuffled options for the current question ID.
      Or simpler: Just a state that holds the current shuffled options and the map.
    */

    // Helper to shuffle options
    // Duplicate removed.

    // Actually lines 28-39 were:
    // const shuffleOptions = (opts: string[]) => { ... };

    // And lines 58-69 were:
    // const shuffleOptions = (opts: string[]) => { ... };

    // I need to remove one of them. Let's remove the second one.

    // State for the *current question's* shuffled options
    const [shuffledState, setShuffledState] = useState<{ options: string[], mapping: number[] } | null>(null);

    if (currentQuestion && (!shuffledState)) {
        // Initial load
        setShuffledState(shuffleOptions(currentQuestion.options));
    }

    const handleAnswer = (displayIndex: number) => {
        if (selectedOption !== null || !shuffledState) return;

        // Map displayIndex to originalIndex
        const originalIndex = shuffledState.mapping[displayIndex];

        setSelectedOption(originalIndex); // Store ORIGINAL index as selection to keep View logic consistent? 
        // Wait, QuestionView expects selectedOption to be index 0-4. 
        // If we pass shuffled options to QuestionView, then QuestionView's "index" matches the shuffled array.
        // So we should store the DISPLAY index or ORIGINAL index?
        // QuestionView highlights based on `selectedOption === iteratorIndex`.
        // So selectedOption MUST be the DISPLAY index.

        setSelectedOption(displayIndex);

        if (originalIndex === currentQuestion.correctIndex) {
            setScore(s => s + 1);
        }
        setShowFeedback(true);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setShuffledState(null); // Force re-shuffle for next question
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
        setShuffledState(null);
    };

    // ... handleEarlyFinish is fine.

    if (isFinished) {
        // ...
    }

    // Prepare data for View using Shuffled State
    // If shuffledState is null (first render cycle), render nothing or waiting?
    if (!currentQuestion || !shuffledState) return <div className={styles.loading}>Loading...</div>;

    /* 
      Issue: We need to tell QuestionView which option is correct for highlighting.
      QuestionView takes `correctOption`: number.
      If we pass SHUFFLED options, we need to pass the SHUFFLED index of the correct answer.
    */
    const correctDisplayIndex = shuffledState.mapping.indexOf(currentQuestion.correctIndex);

    // ... Return JSX
    // Update QuestionView props:
    /*
      question={{ ...currentQuestion, options: shuffledState.options }}
      correctOption={selectedOption !== null ? correctDisplayIndex : null}
    */

    const handleEarlyFinish = () => {
        if (confirm('Are you sure you want to finish the quiz now?')) {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        const questionsAttempted = selectedOption !== null ? currentIndex + 1 : currentIndex;
        // If 0 attempted, avoid division by zero issues in ResultView by passing 0 (ResultView handles NaN? No, we should fix ResultView or handle here).
        // Actually, let's fix ResultView to handle 0, but here passing the logic is key.
        return <ResultView score={score} total={questionsAttempted} onRestart={handleRestart} />;
    }

    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className={styles.gameContainer}>
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
                <QuestionView
                    question={{ ...currentQuestion, options: shuffledState.options }}
                    onAnswer={handleAnswer}
                    disabled={selectedOption !== null}
                    selectedOption={selectedOption}
                    correctOption={selectedOption !== null ? correctDisplayIndex : null}
                />

                {showFeedback && (
                    <FeedbackView
                        isCorrect={shuffledState.mapping[selectedOption!] === currentQuestion.correctIndex}
                        explanation={currentQuestion.explanation}
                        onNext={handleNext}
                        isLastQuestion={currentIndex === questions.length - 1}
                    />
                )}
            </main>
        </div>
    );
}
