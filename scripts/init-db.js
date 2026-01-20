const fs = require('fs');
const path = require('path');

// We need to essentially copy the logic from questions.ts but run it in node to generate the json.
// Or we can just import the logic if we transpile it, but copying is safer/faster for a one-off script without TS setup.

const scienceQuestions = [
    {
        id: 101,
        text: "What is the chemical symbol for Gold?",
        options: ["Au", "Ag", "Fe", "Cu", "Pb"],
        correctIndex: 0,
        explanation: "Au comes from the Latin word for gold, 'Aurum'."
    },
    {
        id: 102,
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Mars", "Saturn", "Mercury"],
        correctIndex: 2,
        explanation: "Mars appears red due to iron oxide on its surface."
    },
    {
        id: 103,
        text: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Platinum", "Quartz"],
        correctIndex: 2,
        explanation: "Diamond is the hardest known natural material."
    },
    {
        id: 104,
        text: "What is the largest organ in the human body?",
        options: ["Heart", "Brain", "Liver", "Skin", "Lungs"],
        correctIndex: 3,
        explanation: "The skin is the body's largest organ."
    },
    {
        id: 105,
        text: "What gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen", "Helium"],
        correctIndex: 1,
        explanation: "Plants absorb Carbon Dioxide for photosynthesis."
    },
    ...Array.from({ length: 15 }, (_, i) => ({
        id: 106 + i,
        text: `Science Question ${i + 6}: What is the atomic number of Element X?`,
        options: ["10", "20", "30", "40", "50"],
        correctIndex: 0,
        explanation: "This is a placeholder explanation for science question."
    }))
];

const historyQuestions = [
    {
        id: 201,
        text: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin", "Abraham Lincoln"],
        correctIndex: 2,
        explanation: "George Washington served as the first president from 1789 to 1797."
    },
    {
        id: 202,
        text: "In which year did World War II end?",
        options: ["1943", "1944", "1945", "1946", "1947"],
        correctIndex: 2,
        explanation: "World War II ended in 1945."
    },
    {
        id: 203,
        text: "Who wrote the 'Declaration of Independence'?",
        options: ["George Washington", "Thomas Jefferson", "Alexander Hamilton", "John Hancock", "James Madison"],
        correctIndex: 1,
        explanation: "Thomas Jefferson was the primary author."
    },
    {
        id: 204,
        text: "Which empire built the Colosseum?",
        options: ["Greek", "Roman", "Ottoman", "Persian", "Egyptian"],
        correctIndex: 1,
        explanation: "The Colosseum was built by the Roman Empire."
    },
    {
        id: 205,
        text: "Who discovered America in 1492?",
        options: ["Vasco da Gama", "Christopher Columbus", "Ferdinand Magellan", "Amerigo Vespucci", "Leif Erikson"],
        correctIndex: 1,
        explanation: "Christopher Columbus led the expedition in 1492."
    },
    ...Array.from({ length: 15 }, (_, i) => ({
        id: 206 + i,
        text: `History Question ${i + 6}: When did Event Y occur?`,
        options: ["1800", "1900", "2000", "1700", "1600"],
        correctIndex: 1,
        explanation: "This is a placeholder explanation for history question."
    }))
];

const geographyQuestions = [
    {
        id: 301,
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Madrid", "Paris", "Rome"],
        correctIndex: 3,
        explanation: "Paris is the capital city of France."
    },
    {
        id: 302,
        text: "Which is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific", "Southern"],
        correctIndex: 3,
        explanation: "The Pacific Ocean is the largest."
    },
    {
        id: 303,
        text: "Mount Everest is located in which mountain range?",
        options: ["Andes", "Rockies", "Alps", "Himalayas", "Appalachians"],
        correctIndex: 3,
        explanation: "Everest is in the Himalayas."
    },
    {
        id: 304,
        text: "Which country has the largest population?",
        options: ["India", "China", "USA", "Indonesia", "Brazil"],
        correctIndex: 0,
        explanation: "India has the largest population as of recent estimates."
    },
    {
        id: 305,
        text: "What is the longest river in the world?",
        options: ["Amazon", "Nile", "Yangtze", "Mississippi", "Danube"],
        correctIndex: 1,
        explanation: "The Nile is generally considered the longest river."
    },
    ...Array.from({ length: 15 }, (_, i) => ({
        id: 306 + i,
        text: `Geography Question ${i + 6}: Where is City Z located?`,
        options: ["Asia", "Europe", "Africa", "Americas", "Oceania"],
        correctIndex: 0,
        explanation: "This is a placeholder explanation for geography question."
    }))
];

const techQuestions = [
    {
        id: 401,
        text: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyper Transfer Main Language", "Home Tool Markup Language", "Hyperlink Text Main Language"],
        correctIndex: 0,
        explanation: "HTML stands for Hyper Text Markup Language."
    },
    {
        id: 402,
        text: "Who founded Microsoft?",
        options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Jeff Bezos", "Elon Musk"],
        correctIndex: 1,
        explanation: "Bill Gates co-founded Microsoft."
    },
    {
        id: 403,
        text: "What is the main brain of a computer?",
        options: ["RAM", "Hard Drive", "CPU", "GPU", "Motherboard"],
        correctIndex: 2,
        explanation: "The CPU (Central Processing Unit) is the brain."
    },
    {
        id: 404,
        text: "Which language is primarily used for Android development?",
        options: ["Swift", "Kotlin", "Ruby", "PHP", "C#"],
        correctIndex: 1,
        explanation: "Kotlin (and Java) is used for Android."
    },
    {
        id: 405,
        text: "What does HTTP stand for?",
        options: ["HyperText Transfer Protocol", "HighText Transfer Protocol", "HyperText Transmission Protocol", "HyperText Time Protocol", "HomeText Transfer Protocol"],
        correctIndex: 0,
        explanation: "HTTP is HyperText Transfer Protocol."
    },
    ...Array.from({ length: 15 }, (_, i) => ({
        id: 406 + i,
        text: `Tech Question ${i + 6}: What does Acronym A stand for?`,
        options: ["Option A", "Option B", "Option C", "Option D", "Option E"],
        correctIndex: 0,
        explanation: "This is a placeholder explanation for tech question."
    }))
];

const literatureQuestions = [
    {
        id: 501,
        text: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain", "Hemingway"],
        correctIndex: 2,
        explanation: "William Shakespeare wrote Romeo and Juliet."
    },
    {
        id: 502,
        text: "Which book series features Harry Potter?",
        options: ["Lord of the Rings", "Harry Potter", "Percy Jackson", "Narnia", "Twilight"],
        correctIndex: 1,
        explanation: "J.K. Rowling wrote the Harry Potter series."
    },
    {
        id: 503,
        text: "Who wrote '1984'?",
        options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "J.D. Salinger", "F. Scott Fitzgerald"],
        correctIndex: 0,
        explanation: "George Orwell wrote 1984."
    },
    {
        id: 504,
        text: "Who wrote 'Pride and Prejudice'?",
        options: ["Emily Bronte", "Charlotte Bronte", "Jane Austen", "Virginia Woolf", "Agatha Christie"],
        correctIndex: 2,
        explanation: "Jane Austen wrote Pride and Prejudice."
    },
    {
        id: 505,
        text: "What is the named of the hobbit protagonist in 'The Hobbit'?",
        options: ["Frodo", "Sam", "Bilbo", "Pippin", "Merry"],
        correctIndex: 2,
        explanation: "Bilbo Baggins is the protagonist."
    },
    ...Array.from({ length: 15 }, (_, i) => ({
        id: 506 + i,
        text: `Literature Question ${i + 6}: Who wrote Book B?`,
        options: ["Author A", "Author B", "Author C", "Author D", "Author E"],
        correctIndex: 0,
        explanation: "This is a placeholder explanation for literature question."
    }))
];

const popCultureQuestions = [
    {
        id: 601,
        text: "Which movie features the character Darth Vader?",
        options: ["Star Trek", "Star Wars", "Avatar", "Alien", "The Matrix"],
        correctIndex: 1,
        explanation: "Darth Vader is a central character in Star Wars."
    },
    {
        id: 602,
        text: "Who is the 'King of Pop'?",
        options: ["Elvis Presley", "Prince", "Michael Jackson", "Madonna", "Freddie Mercury"],
        correctIndex: 2,
        explanation: "Michael Jackson is known as the King of Pop."
    },
    {
        id: 603,
        text: "Which superhero is known as the 'Man of Steel'?",
        options: ["Batman", "Iron Man", "Superman", "Captain America", "Thor"],
        correctIndex: 2,
        explanation: "Superman is the Man of Steel."
    },
    {
        id: 604,
        text: "What is the highest-grossing film of all time (as of 2023)?",
        options: ["Titanic", "Avengers: Endgame", "Avatar", "Star Wars: The Force Awakens", "Jurassic World"],
        correctIndex: 2,
        explanation: "Avatar holds the record."
    },
    {
        id: 605,
        text: "Which band sang 'Bohemian Rhapsody'?",
        options: ["The Beatles", "Rolling Stones", "Queen", "Led Zeppelin", "Pink Floyd"],
        correctIndex: 2,
        explanation: "Queen released Bohemian Rhapsody in 1975."
    },
    ...Array.from({ length: 15 }, (_, i) => ({
        id: 606 + i,
        text: `Pop Culture Question ${i + 6}: Who won the award in Year Y?`,
        options: ["Artist A", "Artist B", "Artist C", "Artist D", "Artist E"],
        correctIndex: 0,
        explanation: "This is a placeholder explanation for pop culture question."
    }))
];

const categories = [
    { id: 'science', name: 'Science', questions: scienceQuestions },
    { id: 'history', name: 'History', questions: historyQuestions },
    { id: 'geography', name: 'Geography', questions: geographyQuestions },
    { id: 'technology', name: 'Technology', questions: techQuestions },
    { id: 'literature', name: 'Literature', questions: literatureQuestions },
    { id: 'pop-culture', name: 'Pop Culture', questions: popCultureQuestions },
];

const dataPath = path.join(__dirname, '../src/data/db.json');
fs.writeFileSync(dataPath, JSON.stringify(categories, null, 2));

console.log('Database initialized at src/data/db.json');
