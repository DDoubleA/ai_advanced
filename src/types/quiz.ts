export interface Question {
  id: number;
  text: string;
  options: string[]; // Array of 5 strings
  correctIndex: number; // 0-4
  explanation: string;
}

export interface Category {
  id: string; // e.g., 'science', 'history'
  name: string;
  questions: Question[];
}
