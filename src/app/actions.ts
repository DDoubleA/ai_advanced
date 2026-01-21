'use server';

import { Category, Question } from '@/types/quiz';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// getCategories removed as we use Prisma directly

export async function addQuestion(categoryId: string, question: Omit<Question, 'id' | 'categoryId'>) {
    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });

    if (!category) {
        throw new Error('Category not found');
    }

    await prisma.question.create({
        data: {
            text: question.text,
            options: question.options,
            correctIndex: question.correctIndex,
            explanation: question.explanation,
            categoryId: category.id,
            isExam: question.isExam ?? false
        }
    });

    revalidatePath('/admin');
    revalidatePath(`/quiz/${categoryId}`);
    return { success: true, message: 'Question added successfully!' };
}

// ... unchanged deleteQuestion ...

export async function deleteQuestion(categoryId: string, questionId: number) {
    try {
        await prisma.question.delete({
            where: { id: questionId }
        });
    } catch (e) {
        console.error("Failed to delete question", e);
        throw new Error('Failed to delete question');
    }

    revalidatePath('/admin');
    revalidatePath(`/quiz/${categoryId}`);
    return { success: true, message: 'Question deleted successfully!' };
}

export async function updateQuestion(categoryId: string, updatedQuestion: Question) {
    try {
        await prisma.question.update({
            where: { id: updatedQuestion.id },
            data: {
                text: updatedQuestion.text,
                options: updatedQuestion.options,
                correctIndex: updatedQuestion.correctIndex,
                explanation: updatedQuestion.explanation,
                categoryId: categoryId, // Ensure category integrity
                isExam: updatedQuestion.isExam ?? false
            }
        });
    } catch (e) {
        console.error("Failed to update question", e);
        throw new Error('Question not found or update failed');
    }

    revalidatePath('/admin');
    revalidatePath(`/quiz/${categoryId}`);
    return { success: true, message: 'Question updated successfully!' };
}

// ... unchanged login/logout ...

export async function login(password: string) {
    if (password === 'admin123') {
        (await cookies()).set('admin_auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        return { success: true };
    }
    return { success: false, message: 'Invalid password' };
}

export async function logout() {
    (await cookies()).delete('admin_auth');
    return { success: true };
}

export async function getQuestionsByIds(ids: number[]): Promise<Question[]> {
    if (!ids.length) return [];

    try {
        const questions = await prisma.question.findMany({
            where: {
                id: { in: ids }
            }
        });

        return questions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            categoryId: q.categoryId,
            isExam: q.isExam
        }));
    } catch (e) {
        console.error("Failed to fetch questions by IDs", e);
        return [];
    }
}

export async function createInquiry(questionId: number, content: string) {
    try {
        await prisma.inquiry.create({
            data: {
                questionId,
                content,
                status: 'OPEN'
            }
        });
        return { success: true, message: 'Inquiry submitted successfully!' };
    } catch (e) {
        console.error("Failed to create inquiry", e);
        return { success: false, message: 'Failed to submit inquiry.' };
    }
}

export async function getInquiries() {
    try {
        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                question: true // Fetch all question fields to allow editing
            }
        });
        return inquiries;
    } catch (e) {
        console.error("Failed to fetch inquiries", e);
        return [];
    }
}

export async function resolveInquiry(id: number) {
    try {
        await prisma.inquiry.update({
            where: { id },
            data: { status: 'RESOLVED' }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error("Failed to resolve inquiry", e);
        return { success: false };
    }
}
