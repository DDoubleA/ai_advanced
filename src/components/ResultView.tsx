import Link from 'next/link';
import styles from './ResultView.module.css';

interface ResultViewProps {
    score: number;
    total: number;
    onRestart: () => void;
}

export default function ResultView({ score, total, onRestart }: ResultViewProps) {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    let message = '';
    if (percentage === 100) message = 'Perfect Score! 🏆';
    else if (percentage >= 80) message = 'Great Job! 🌟';
    else if (percentage >= 60) message = 'Good Effort! 👍';
    else message = 'Keep Practicing! 💪';

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Quiz Completed!</h2>

            <div className={styles.scoreCard}>
                <div className={styles.scoreCircle}>
                    <span className={styles.scoreNumber}>{score}</span>
                    <span className={styles.scoreTotal}>/ {total}</span>
                </div>
                <p className={styles.percentage}>{percentage}%</p>
            </div>

            <h3 className={styles.message}>{message}</h3>

            <div className={styles.actions}>
                <button className={styles.restartButton} onClick={onRestart}>
                    Try Again
                </button>
                <Link href="/" className={styles.homeButton}>
                    Back to Categories
                </Link>
            </div>
        </div>
    );
}
