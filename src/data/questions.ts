import { Category } from '@/types/quiz';
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
                explanation: q.explanation
            }))
        }));
    } catch (error) {
        console.error('Error fetching categories from DB:', error);
        return [];
    }
};

export const getCategory = async (id: string): Promise<Category | undefined> => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: {
            questions: true
        }
    });

    if (!category) return undefined;

    return {
        id: category.id,
        name: category.name,
        questions: category.questions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation
        }))
    };
};
