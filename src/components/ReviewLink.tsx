'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getIncorrectQuestionIds } from '@/utils/storage';
import styles from './CategoryCard.module.css'; // Use same styles

export default function ReviewLink() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const ids = getIncorrectQuestionIds();
        setCount(ids.length);
    }, []);

    if (count === 0) return null;

    return (
        <Link href="/quiz/review" className={styles.card}>
            <div className={styles.content}>
                <h2 className={styles.title}>틀린 문제 복습</h2>
                <p className={styles.info}>틀린 {count}문제를 다시 풀어보세요.</p>
            </div>
            <div className={styles.icon}>
                ❌
            </div>
        </Link>
    );
}
