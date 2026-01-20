import { formatCategories } from '@/data/questions';
import CategoryCard from '@/components/CategoryCard';
import styles from './page.module.css';

export default function Home() {
  const categories = formatCategories();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Quiz Master</h1>
        <p className={styles.subtitle}>Choose a category to start your challenge!</p>
      </header>

      <div className={styles.grid}>
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
