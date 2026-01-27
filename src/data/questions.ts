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

    // 2. Fetch all question IDs for this category (Lightweight)
    const allQuestionIds = await prisma.question.findMany({
        where: { categoryId: id },
        select: { id: true }
    });

    // 3. Shuffle IDs and pick 20
    const shuffledIds = allQuestionIds
        .map(q => q.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 20);

    // 4. Fetch details for the selected questions
    const selectedQuestions = await prisma.question.findMany({
        where: {
            id: { in: shuffledIds }
        }
    });

    // 5. Restore random order (since findMany might return sorted by ID)
    const questionMap = new Map(selectedQuestions.map(q => [q.id, q]));
    const orderedQuestions = shuffledIds
        .map(id => questionMap.get(id))
        .filter((q): q is typeof selectedQuestions[0] => q !== undefined);

    return {
        id: categoryInfo.id,
        name: categoryInfo.name,
        questions: orderedQuestions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            categoryId: categoryInfo.id,
            isExam: q.isExam
        }))
    };
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
