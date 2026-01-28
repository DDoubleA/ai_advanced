
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CustomQuizForm.module.css';

interface Category {
    id: string;
    name: string;
}

interface Props {
    categories: Category[];
}

export default function CustomQuizForm({ categories }: Props) {
    const router = useRouter();
    const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
    const [isExamOnly, setIsExamOnly] = useState(false);

    const toggleCategory = (id: string) => {
        const next = new Set(selectedCats);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedCats(next);
    };

    const handleStart = () => {
        if (selectedCats.size === 0) {
            alert('Please select at least one category.');
            return;
        }
        const catStr = Array.from(selectedCats).join(',');
        router.push(`/quiz/custom?c=${catStr}&exam=${isExamOnly}`);
    };

    return (
        <section className={styles.container}>
            <h2 className={styles.sectionTitle}>🏆 나만의 퀴즈 만들기</h2>
            <div className={styles.options}>
                <div className={styles.categoryList}>
                    {categories.map(cat => (
                        <label key={cat.id} className={`${styles.checkboxLabel} ${selectedCats.has(cat.id) ? styles.checked : ''}`}>
                            <input
                                type="checkbox"
                                checked={selectedCats.has(cat.id)}
                                onChange={() => toggleCategory(cat.id)}
                                className={styles.hiddenCheckbox}
                            />
                            {cat.name}
                        </label>
                    ))}
                </div>

                <div className={styles.controls}>
                    <label className={styles.toggleLabel}>
                        <input
                            type="checkbox"
                            checked={isExamOnly}
                            onChange={(e) => setIsExamOnly(e.target.checked)}
                        />
                        <span className={styles.toggleText}>기출 문제만 보기</span>
                    </label>

                    <button
                        onClick={handleStart}
                        className={styles.startButton}
                        disabled={selectedCats.size === 0}
                    >
                        Start Custom Quiz ➔
                    </button>
                </div>
            </div>
        </section>
    );
}
