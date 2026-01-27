import Link from 'next/link';
import styles from './CategoryCard.module.css';

interface CategoryCardProps {
    id: string;
    name: string;
    questionCount?: number;
}

export default function CategoryCard({ id, name, questionCount }: CategoryCardProps) {
    return (
        <Link href={`/quiz/${id}`} className={styles.card}>
            <div className={styles.content}>
                <h2 className={styles.title}>{name}</h2>
                {questionCount !== undefined && <p className={styles.info}>{questionCount} Questions</p>}
            </div>
            <div className={styles.icon}>
                {/* Simple decorative icon or initial */}
                {name.charAt(0)}
            </div>
        </Link>
    );
}
