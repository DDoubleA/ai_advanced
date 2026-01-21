import { useState } from 'react';
import { createInquiry } from '@/app/actions';
import styles from './FeedbackView.module.css';

interface FeedbackViewProps {
    isCorrect: boolean;
    explanation: string;
    onNext: () => void;
    isLastQuestion: boolean;
    questionId: number; // Needed for inquiry
}

export default function FeedbackView({ isCorrect, explanation, onNext, isLastQuestion, questionId }: FeedbackViewProps) {
    const [showInquiry, setShowInquiry] = useState(false);
    const [inquiryContent, setInquiryContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleSubmitInquiry = async () => {
        if (!inquiryContent.trim()) return;
        setIsSubmitting(true);
        const result = await createInquiry(questionId, inquiryContent);
        setSubmitMessage(result.message);
        setIsSubmitting(false);
        if (result.success) {
            setInquiryContent('');
            setTimeout(() => {
                setShowInquiry(false);
                setSubmitMessage('');
            }, 2000);
        }
    };

    return (
        <div className={`${styles.container} ${isCorrect ? styles.containerCorrect : styles.containerWrong}`}>
            <div className={styles.content}>
                <h3 className={styles.title}>
                    {isCorrect ? 'Correct! 🎉' : 'Incorrect 😞'}
                </h3>
                <p className={styles.explanation}>
                    <strong>Explanation:</strong> {explanation}
                </p>

                {showInquiry ? (
                    <div className={styles.inquiryForm}>
                        <h4>Report Issue</h4>
                        <textarea
                            className={styles.textarea}
                            placeholder="Describe the issue..."
                            value={inquiryContent}
                            onChange={(e) => setInquiryContent(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {submitMessage && <p className={styles.message}>{submitMessage}</p>}
                        <div className={styles.actions}>
                            <button
                                className={`${styles.button} ${styles.cancelButton}`}
                                onClick={() => setShowInquiry(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${styles.button} ${styles.submitButton}`}
                                onClick={handleSubmitInquiry}
                                disabled={isSubmitting || !inquiryContent.trim()}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.footer}>
                        <button className={styles.inquiryButton} onClick={() => setShowInquiry(true)}>
                            Report Issue 🚨
                        </button>
                        <button className={styles.nextButton} onClick={onNext}>
                            {isLastQuestion ? 'See Results' : 'Next Question'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
