import styles from './FeedbackView.module.css';

interface FeedbackViewProps {
    isCorrect: boolean;
    explanation: string;
    onNext: () => void;
    isLastQuestion: boolean;
}

export default function FeedbackView({ isCorrect, explanation, onNext, isLastQuestion }: FeedbackViewProps) {
    return (
        <div className={`${styles.container} ${isCorrect ? styles.containerCorrect : styles.containerWrong}`}>
            <div className={styles.content}>
                <h3 className={styles.title}>
                    {isCorrect ? 'Correct! 🎉' : 'Incorrect 😞'}
                </h3>
                <p className={styles.explanation}>
                    <strong>Explanation:</strong> {explanation}
                </p>
                <button className={styles.nextButton} onClick={onNext}>
                    {isLastQuestion ? 'See Results' : 'Next Question'}
                </button>
            </div>
        </div>
    );
}
