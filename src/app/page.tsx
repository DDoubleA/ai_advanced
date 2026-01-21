import { formatCategories } from '@/data/questions';
import CategoryCard from '@/components/CategoryCard';
import ReviewLink from '@/components/ReviewLink';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categories = await formatCategories();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Advanced</h1>

      </header>

      <div className={styles.grid}>
        <ReviewLink />
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            questionCount={category.questions.length}
          />
        ))}
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2026 Quiz App</p>
      </footer>
    </main>
  );
}
