'use client';

import { useState, useEffect } from 'react';
import { Category, Question } from '@/types/quiz';
import { addQuestion, deleteQuestion, updateQuestion, logout, getInquiries, resolveInquiry } from '../actions';
import styles from './AdminDashboard.module.css';

interface AdminDashboardProps {
    categories: Category[];
}

interface Inquiry {
    id: number;
    questionId: number;
    content: string;
    status: string;
    createdAt: Date;
    question: Question;
}

export default function AdminDashboard({ categories }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<'questions' | 'inquiries'>('questions');
    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    // Form State
    const [text, setText] = useState('');
    const [options, setOptions] = useState(['', '', '', '', '']);
    const [correctIndex, setCorrectIndex] = useState(0);
    const [explanation, setExplanation] = useState('');
    const [isExam, setIsExam] = useState(false);

    const currentCategory = categories.find(c => c.id === selectedCategory);

    useEffect(() => {
        if (activeTab === 'inquiries') {
            loadInquiries();
        }
    }, [activeTab]);

    const loadInquiries = async () => {
        const data = await getInquiries();
        setInquiries(data);
    };

    const handleResolve = async (id: number) => {
        if (!confirm('Mark this inquiry as resolved?')) return;
        await resolveInquiry(id);
        loadInquiries();
    };

    const resetForm = () => {
        setText('');
        setOptions(['', '', '', '', '']);
        setCorrectIndex(0);
        setExplanation('');
        setIsExam(false);
        setEditingId(null);
        setIsAdding(false);
    };

    const startAdding = () => {
        resetForm();
        setIsAdding(true);
    };

    const startEditing = (q: Question) => {
        setText(q.text);
        setOptions([...q.options]);
        setCorrectIndex(q.correctIndex);
        setExplanation(q.explanation);
        setIsExam(q.isExam || false);
        setEditingId(q.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCategory) return;

        if (options.some(opt => !opt.trim())) {
            alert('Please fill in all options.');
            return;
        }

        try {
            if (editingId !== null) {
                await updateQuestion(currentCategory.id, {
                    id: editingId,
                    text,
                    options,
                    correctIndex,
                    explanation,
                    categoryId: currentCategory.id,
                    isExam
                });
                alert('Question updated!');
            } else {
                await addQuestion(currentCategory.id, {
                    text,
                    options,
                    correctIndex,
                    explanation,
                    isExam
                });
                alert('Question added!');
            }
            resetForm();
        } catch (error) {
            alert('Failed to save question');
        }
    };

    // ... unchanged handleDelete ...

    const handleDelete = async (qId: number) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        await deleteQuestion(selectedCategory, qId);
        if (editingId === qId) {
            resetForm();
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    const handleOptionChange = (idx: number, val: string) => {
        const newOpts = [...options];
        newOpts[idx] = val;
        setOptions(newOpts);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.title}>Quiz Admin Dashboard</h1>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'questions' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('questions')}
                    >
                        Manage Questions
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'inquiries' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('inquiries')}
                    >
                        Inquiries
                    </button>
                </div>

                {activeTab === 'questions' && (
                    <div className={styles.controls}>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                resetForm();
                            }}
                            className={styles.select}
                        >
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <button className={styles.addButton} onClick={isAdding ? resetForm : startAdding}>
                            {isAdding ? 'Cancel' : 'Add New Question'}
                        </button>
                    </div>
                )}
            </header>

            {activeTab === 'questions' ? (
                <>
                    {isAdding && (
                        <form className={styles.form} onSubmit={handleAddSubmit}>
                            <h3>{editingId ? 'Edit Question' : `Add New Question to ${currentCategory?.name}`}</h3>
                            <div className={styles.formGroup}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={isExam}
                                        onChange={(e) => setIsExam(e.target.checked)}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    기출문제 (Past Exam Question)
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Question Text</label>
                                <input required value={text} onChange={e => setText(e.target.value)} className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Options</label>
                                {options.map((opt, i) => (
                                    <div key={i} className={styles.optionRow}>
                                        <input
                                            type="radio"
                                            name="correct"
                                            checked={correctIndex === i}
                                            onChange={() => setCorrectIndex(i)}
                                        />
                                        <input
                                            required
                                            value={opt}
                                            onChange={e => handleOptionChange(i, e.target.value)}
                                            placeholder={`Option ${i + 1}`}
                                            className={styles.input}
                                        />
                                    </div>
                                ))}
                                <small>Select the radio button for the correct answer.</small>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Explanation</label>
                                <textarea required value={explanation} onChange={e => setExplanation(e.target.value)} className={styles.textarea} />
                            </div>

                            <button type="submit" className={styles.submitButton}>
                                {editingId ? 'Save Question' : 'Add Question'}
                            </button>
                        </form>
                    )}

                    <div className={styles.list}>
                        <h3>Existing Questions ({currentCategory?.questions.length})</h3>
                        {currentCategory?.questions.slice().reverse().map(q => (
                            <div
                                key={q.id}
                                className={styles.questionItem}
                                onClick={() => startEditing(q)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.questionContent}>
                                    <p className={styles.qText}><strong>Q:</strong> {q.text}</p>
                                    <p className={styles.qAnswer}><strong>A:</strong> {q.options[q.correctIndex]} ({q.explanation})</p>
                                </div>
                                <div className={styles.itemActions}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEditing(q);
                                        }}
                                        className={styles.editButton}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(q.id);
                                        }}
                                        className={styles.deleteButton}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className={styles.list}>
                    <h3>User Inquiries</h3>
                    {inquiries.length === 0 && <p>No inquiries found.</p>}
                    {inquiries.map(inquiry => (
                        <div key={inquiry.id} className={styles.inquiryItem}>
                            <div className={styles.inquiryHeader}>
                                <span className={`${styles.inquiryStatus} ${styles['status' + inquiry.status]}`}>
                                    {inquiry.status}
                                </span>
                                <small>{new Date(inquiry.createdAt).toLocaleString()}</small>
                            </div>
                            <div className={styles.inquiryContent}>
                                <strong>User Issue:</strong>
                                <p>{inquiry.content}</p>
                            </div>
                            <div className={styles.relatedQuestion}>
                                <strong>Related Question:</strong> {inquiry.question.text} (Q#{inquiry.question.id})
                            </div>
                            <div className={styles.inquiryActions}>
                                <button
                                    className={`${styles.resolveButton} ${styles.actionBtn}`}
                                    onClick={() => {
                                        startEditing(inquiry.question as Question);
                                        setActiveTab('questions');
                                        setSelectedCategory(inquiry.question.categoryId); // Ensure category is selected
                                    }}
                                >
                                    Edit Question ✏️
                                </button>
                                {inquiry.status === 'OPEN' && (
                                    <button className={`${styles.resolveButton} ${styles.actionBtn}`} onClick={() => handleResolve(inquiry.id)}>
                                        Mark as Resolved ✅
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
