'use server';

import { Category, Question } from '@/types/quiz';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

const getCategories = (): Category[] => {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (e) {
        return [];
    }
};

const saveCategories = (categories: Category[]) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(categories, null, 2));
};

export async function addQuestion(categoryId: string, question: Omit<Question, 'id'>) {
    const categories = getCategories();
    const category = categories.find(c => c.id === categoryId);

    if (!category) {
        throw new Error('Category not found');
    }

    // Generate new ID (simple max + 1)
    const allQuestionIds = categories.flatMap(c => c.questions).map(q => q.id);
    const newId = (Math.max(...allQuestionIds, 0)) + 1;

    const newQuestion: Question = {
        ...question,
        id: newId,
    };

    category.questions.push(newQuestion);
    saveCategories(categories);
    revalidatePath('/admin');
    revalidatePath(`/quiz/${categoryId}`);
    return { success: true, message: 'Question added successfully!' };
}

export async function deleteQuestion(categoryId: string, questionId: number) {
    const categories = getCategories();
    const category = categories.find(c => c.id === categoryId);

    if (!category) {
        throw new Error('Category not found');
    }

    category.questions = category.questions.filter(q => q.id !== questionId);
    saveCategories(categories);
    revalidatePath('/admin');
    revalidatePath(`/quiz/${categoryId}`);
    return { success: true, message: 'Question deleted successfully!' };
}

export async function updateQuestion(categoryId: string, updatedQuestion: Question) {
    const categories = getCategories();
    const category = categories.find(c => c.id === categoryId);

    if (!category) {
        throw new Error('Category not found');
    }

    const questionIndex = category.questions.findIndex(q => q.id === updatedQuestion.id);
    if (questionIndex === -1) {
        throw new Error('Question not found');
    }

    category.questions[questionIndex] = updatedQuestion;
    saveCategories(categories);
    revalidatePath('/admin');
    revalidatePath(`/quiz/${categoryId}`);
    return { success: true, message: 'Question updated successfully!' };
}

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
