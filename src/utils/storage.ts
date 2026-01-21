
const STORAGE_KEY = 'quiz_incorrect_ids';

export function getIncorrectQuestionIds(): number[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function saveIncorrectQuestionId(id: number) {
    const ids = getIncorrectQuestionIds();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
}

export function removeIncorrectQuestionId(id: number) {
    const ids = getIncorrectQuestionIds();
    const newIds = ids.filter(existingId => existingId !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
}
