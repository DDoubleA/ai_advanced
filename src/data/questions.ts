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
    // 1. Fetch category info
    const categoryInfo = await prisma.category.findUnique({
        where: { id },
        select: { id: true, name: true }
    });

    if (!categoryInfo) return undefined;

    // 2. Fetch 20 random questions directly using Raw SQL (PostgreSQL specific)
    // This is faster than application-side shuffling for small/medium datasets
    try {
        const questions = await prisma.$queryRaw<Question[]>`
            SELECT id, text, options, "correctIndex", explanation, "categoryId", "isExam"
            FROM "Question"
            WHERE "categoryId" = ${id}
            ORDER BY RANDOM()
            LIMIT 20;
        `;

        return {
            id: categoryInfo.id,
            name: categoryInfo.name,
            questions: questions.map(q => ({
                id: q.id,
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                categoryId: categoryInfo.id,
                isExam: q.isExam
            }))
        };
    } catch (e) {
        console.error("Failed to fetch random questions", e);
        return undefined;
    }
};

export const getCategoriesSummary = async () => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: { questions: true }
                }
            },
            orderBy: {
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

        return categories.sort((a, b) => {
            return ORDER.indexOf(a.id) - ORDER.indexOf(b.id);
        }).map(c => ({
            id: c.id,
            name: c.name,
            questionCount: c._count.questions
        }));
    } catch (error) {
        console.error('Error fetching categories summary:', error);
        return [];
    }
};
