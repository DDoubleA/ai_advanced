import { getCategory, formatCategories } from '@/data/questions';
import QuizGame from '@/components/QuizGame';
import styles from './page.module.css';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ categoryId: string }>;
}

export async function generateStaticParams() {
    const categories = await formatCategories();
    return categories.map((category) => ({
        categoryId: category.id,
    }));
}

export default async function QuizPage({ params }: PageProps) {
    const { categoryId } = await params;
    const category = await getCategory(categoryId);

    if (category) {
        // Randomize questions: Shuffle and take 20
        const shuffledQuestions = [...category.questions]
            .sort(() => 0.5 - Math.random())
            .slice(0, 20);
        category.questions = shuffledQuestions;
    }

    if (!category) {
        return (
            <div className={styles.errorContainer}>
                <h1>Category Not Found</h1>
                <p>We couldn&apos;t find the quiz you are looking for.</p>
                <Link href="/" className={styles.backLink}>Go Home</Link>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <Link href="/" className={styles.backButton}>&larr; Exit</Link>
            <QuizGame questions={category.questions} categoryName={category.name} />
        </div>
    );
}
