import { Category, Question } from '@/types/quiz';
import { prisma } from '@/lib/prisma';

// Fetch all categories with their questions
export const formatCategories = async (): Promise<Category[]> => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                questions: {
                    orderBy: {
                        id: 'asc'
                    }
                }
            },
            orderBy: {
                // Determine order if needed, or by name/id
                id: 'asc'
            }
        });

        const ORDER = [
            'python-basics',
            'data-analysis',
            'llm-basics',
            'prompt-engineering',
            'rag-agent',
            'fine-tuning'
        ];

        const sortedCategories = categories.sort((a, b) => {
            return ORDER.indexOf(a.id) - ORDER.indexOf(b.id);
        });

        return sortedCategories.map(c => ({
            id: c.id,
            name: c.name,
            questions: c.questions.map(q => ({
                id: q.id,
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                categoryId: c.id,
                isExam: q.isExam
            }))
        }));
    } catch (error) {
        console.error('Error fetching categories from DB:', error);
        return [];
    }
};

export const getCategory = async (id: string): Promise<Category | undefined> => {
    try {
        // Merge into a single query using LEFT JOIN to handle empty categories
        // and fetch category details + random questions in one go.
        const results = await prisma.$queryRaw<any[]>`
            SELECT
                c.id as "catId",
                c.name as "catName",
                q.id,
                q.text,
                q.options,
                q."correctIndex",
                q.explanation,
                q."categoryId",
                q."isExam"
            FROM "Category" c
            LEFT JOIN "Question" q ON c.id = q."categoryId"
            WHERE c.id = ${id}
            ORDER BY RANDOM()
            LIMIT 20;
        `;

        if (results.length === 0) return undefined;

        const first = results[0];

        // Check if there are valid questions (id is not null)
        // If LEFT JOIN returns nulls for question fields, it means no questions exist.
        const questions = first.id ? results.map(row => ({
            id: row.id,
            text: row.text,
            options: row.options,
            correctIndex: row.correctIndex,
            explanation: row.explanation,
            categoryId: row.categoryId,
            isExam: row.isExam
        })) : [];

        return {
            id: first.catId,
            name: first.catName,
            questions: questions as Question[]
        };

    } catch (e) {
        console.error("Failed to fetch custom joined data", e);
        return undefined;
    }
};

export const getCategoriesSummary = async () => {
    // Static data to eliminate DB query latency for the Home Page
    // Tuned for maximum speed as requested by user
    const STATIC_CATEGORIES = [
        { id: 'python-basics', name: 'Python 기초' },
        { id: 'data-analysis', name: '데이터 분석' },
        { id: 'llm-basics', name: 'LLM 기본' },
        { id: 'prompt-engineering', name: '프롬프트 엔지니어링' },
        { id: 'rag-agent', name: 'RAG Agent' },
        { id: 'fine-tuning', name: 'Fine Tuning' }
    ];

    return STATIC_CATEGORIES;
};
