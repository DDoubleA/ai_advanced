
import { getCustomQuiz } from '@/data/questions';
import QuizGame from '@/components/QuizGame';
import styles from './page.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CustomQuizPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const catParam = params.c;
    const isExam = params.exam === 'true';

    // Parse category IDs
    let categoryIds: string[] = [];
    if (typeof catParam === 'string') {
        categoryIds = catParam.split(',').filter(Boolean);
    } else if (Array.isArray(catParam)) {
        categoryIds = catParam.flatMap(x => (x || '').split(',')).filter(Boolean);
    }

    if (categoryIds.length === 0) {
        return (
            <div className={styles.errorContainer}>
                <h1>No Categories Selected</h1>
                <p>Please select at least one category to start a quiz.</p>
                <Link href="/" className={styles.backLink}>Go Home</Link>
            </div>
        );
    }

    const questions = await getCustomQuiz(categoryIds, isExam);

    if (questions.length === 0) {
        return (
            <div className={styles.errorContainer}>
                <h1>No Questions Found</h1>
                <p>No questions matched your criteria (Categories: {categoryIds.join(', ')}, Exam: {isExam ? 'Yes' : 'No'}).</p>
                <Link href="/" className={styles.backLink}>Go Home</Link>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <Link href="/" className={styles.backButton}>&larr; Exit</Link>
            <QuizGame
                questions={questions}
                categoryName={isExam ? "Custom Exam Quiz" : "Custom Quiz"}
            />
        </div>
    );
}
