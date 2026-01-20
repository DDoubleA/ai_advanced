import { Category } from '@/types/quiz';
import fs from 'fs';
import path from 'path';

// For caching/singleton in dev environment to avoid re-reading every request if desired, 
// but for Admin functionality we want fresh data.
// In Server Components we can read directly.

export const formatCategories = (): Category[] => {
    // In a real Vercel deployment, this file write won't persist.
    // We need to use process.cwd() to find the file correctly in Next.js
    const dataPath = path.join(process.cwd(), 'src/data/db.json');

    try {
        const fileContents = fs.readFileSync(dataPath, 'utf8');
        const categories = JSON.parse(fileContents);
        return categories;
    } catch (error) {
        console.error('Error reading db.json', error);
        return [];
    }
};

export const getCategory = (id: string): Category | undefined => {
    return formatCategories().find(c => c.id === id);
};
