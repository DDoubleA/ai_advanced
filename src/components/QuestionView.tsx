import styles from './QuestionView.module.css';
import { Question } from '@/types/quiz';

interface QuestionViewProps {
    question: Question;
    onAnswer: (index: number) => void;
    disabled: boolean;
    selectedOption: number | null;
    correctOption: number | null; // Pass this ONLY if we want to reveal it immediately styling-wise, though FeedbackView might handle it.
}

export default function QuestionView({ question, onAnswer, disabled, selectedOption, correctOption }: QuestionViewProps) {
    return (
        <div className={styles.container}>
            <h2 className={styles.questionText}>
                <span className={styles.questionNumber}>Q{question.id % 20 === 0 ? 20 : question.id % 20}. </span>
                {question.text}
            </h2>

            <div className={styles.optionsGrid}>
                {question.options.map((option, index) => {
                    let optionClass = styles.optionButton;

                    if (selectedOption !== null) {
                        // If this specific option was selected
                        if (selectedOption === index) {
                            optionClass = `${styles.optionButton} ${correctOption === index ? styles.correct : styles.wrong}`;
                        }
                        // If we want to highlight the correct answer even if they chose wrong
                        if (correctOption === index && selectedOption !== index) {
                            optionClass = `${styles.optionButton} ${styles.revealCorrect}`;
                        }
                    }

                    return (
                        <button
                            key={index}
                            className={optionClass}
                            onClick={() => onAnswer(index)}
                            disabled={disabled}
                        >
                            <span className={styles.optionLetter}>{String.fromCharCode(65 + index)}</span>
                            <span className={styles.optionText}>{option}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
