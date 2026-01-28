import { getCategoriesSummary } from '@/data/questions';
import CategoryCard from '@/components/CategoryCard';
import ReviewLink from '@/components/ReviewLink';
import CustomQuizForm from '@/components/CustomQuizForm';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categories = await getCategoriesSummary();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Advanced</h1>

      </header>

      <div className={styles.container}>
        <CustomQuizForm categories={categories} />

        <h2 className={styles.subtitle}>📚 주제별 학습</h2>
        <div className={styles.grid}>
          <ReviewLink />
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
            />
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2026 Quiz App</p>
      </footer>
    </main>
  );
}
