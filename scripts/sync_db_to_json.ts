
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

// The 10 manual questions to append to 'data-analysis'
const newQuestions = [
    {
        text: "NumPy 배열과 Python 리스트의 가장 큰 차이점은?",
        options: [
            "NumPy 배열은 서로 다른 데이터 타입을 자유롭게 담을 수 있어 리스트보다 유연하다.",
            "NumPy 배열은 C로 구현되어 있어 대용량 데이터 연산 속도가 훨씬 빠르다.",
            "Python 리스트는 다차원 구조(행렬 등)를 전혀 만들 수 없다.",
            "NumPy 배열은 인덱싱(Indexing) 기능을 지원하지 않는다.",
            "두 자료구조 간에는 성능이나 기능상 차이점이 없다."
        ],
        correctIndex: 1,
        explanation: "NumPy는 C 언어로 구현된 함수를 사용하여 파이썬의 기본 리스트보다 벡터·행렬·텐서 연산을 훨씬 빠르게 수행할 수 있습니다.",
        isExam: true
    },
    {
        text: "Pandas에서 CSV 파일을 불러오는 함수로 올바른 것은?",
        options: [
            "pd.load_csv()",
            "pd.get_csv()",
            "pd.read_csv()",
            "pd.import_csv()",
            "pd.open_csv()"
        ],
        correctIndex: 2,
        explanation: "Pandas는 CSV 파일 로드에 특화된 pd.read_csv() 함수를 제공하며, JSON은 pd.read_json()을 사용합니다.",
        isExam: true
    },
    {
        text: "두 DataFrame을 특정 컬럼(Key)을 기준으로 SQL의 JOIN처럼 합치는 함수는?",
        options: [
            "concat()",
            "append()",
            "merge()",
            "split()",
            "select()"
        ],
        correctIndex: 2,
        explanation: "merge() 함수는 SQL의 JOIN과 유사하게 공통된 컬럼(Key)을 기준으로 데이터를 병합하는 기능을 수행합니다.",
        isExam: true
    },
    {
        text: "Pandas에서 결측치(NaN)를 확인하거나 처리할 때 사용하는 메서드와 거리가 먼 것은?",
        options: [
            "isnull()",
            "fillna()",
            "dropna()",
            "info()",
            "groupby()"
        ],
        correctIndex: 4,
        explanation: "isnull()은 결측치 확인, fillna()는 채우기 등에 사용됩니다. 반면 groupby()는 데이터를 그룹화하여 통계를 계산할 때 사용합니다.",
        isExam: true
    },
    {
        text: "Pandas groupby() 메서드의 주된 용도는 무엇인가요?",
        options: [
            "데이터의 행과 열을 바꾸기 위해 (Transpose)",
            "특정 기준(컬럼)에 따라 데이터를 묶어서 평균, 합계 등 통계 연산을 수행하기 위해",
            "데이터의 결측치를 자동으로 제거하기 위해",
            "두 개의 데이터프레임을 위아래로 단순히 이어 붙이기 위해",
            "문자열 데이터를 날짜 데이터로 변환하기 위해"
        ],
        correctIndex: 1,
        explanation: "groupby()는 특정 기준(컬럼)으로 데이터를 묶어서 통계(평균, 합계 등)를 계산할 때 사용되는 핵심 함수입니다.",
        isExam: true
    },
    {
        text: "텍스트 전처리 중 '불용어(Stopwords)'의 예시로 가장 적절한 것은?",
        options: [
            "인공지능, 머신러닝",
            "Python, Java, C++",
            "2024, 100, 3.14",
            "그리고, 은, 는, 이, 가",
            "삼성SDS, 데이터 분석"
        ],
        correctIndex: 3,
        explanation: "불용어 처리는 \"이\", \"있\", \"것\", \"그리고\"와 같이 문법적 기능은 하지만 분석에 큰 의미가 없는 조사나 접속사 등을 제거하는 과정입니다.",
        isExam: true
    },
    {
        text: "정규표현식(Regex)에서 숫자를 의미하며, 전화번호나 날짜 추출에 유용한 패턴은?",
        options: [
            "\\w",
            "\\s",
            "\\d",
            "\\b",
            "\\t"
        ],
        correctIndex: 2,
        explanation: "정규표현식에서 \\d+ (digit) 패턴은 숫자를 의미하며, 이를 통해 텍스트 내의 날짜, 전화번호 등 숫자 데이터를 추출할 수 있습니다.",
        isExam: true
    },
    {
        text: "텍스트를 문맥이 반영되도록 N개의 연속된 단어 묶음으로 처리하는 기법은?",
        options: [
            "One-hot Encoding",
            "N-gram",
            "Stemming (어간 추출)",
            "Padding",
            "Dropout"
        ],
        correctIndex: 1,
        explanation: "N-gram은 연속된 n개의 단어 묶음을 생성하여(\"딥러닝 모델을\", \"모델을 학습시키기\") 단어의 순서와 문맥을 반영할 수 있는 기법입니다.",
        isExam: true
    },
    {
        text: "TF-IDF에서 IDF(Inverse Document Frequency) 값이 높다는 것의 의미는?",
        options: [
            "해당 단어가 모든 문서에서 매우 흔하게 등장한다.",
            "해당 단어가 문서 내에서 가장 많이 반복되었다.",
            "해당 단어의 글자 수가 많다.",
            "전체 문서 집합에서 해당 단어가 포함된 문서가 적어 희귀하다.",
            "해당 단어가 문법적으로 중요하지 않은 불용어이다."
        ],
        correctIndex: 3,
        explanation: "IDF는 전체 문서 수 대비 해당 단어가 포함된 문서 수의 비율을 역수로 계산한 값으로, 희귀한 단어일수록 높은 값을 가지며 중요한 단어로 취급됩니다.",
        isExam: true
    },
    {
        text: "텍스트 임베딩 벡터 간의 유사도를 측정할 때, 벡터의 크기보다는 '방향(각도)'의 유사성을 중시하는 지표는?",
        options: [
            "유클리드 거리 (Euclidean Distance)",
            "맨해튼 거리 (Manhattan Distance)",
            "자카드 유사도 (Jaccard Similarity)",
            "코사인 유사도 (Cosine Similarity)",
            "피어슨 상관계수 (Pearson Correlation)"
        ],
        correctIndex: 3,
        explanation: "코사인 유사도(Cosine Similarity)는 두 벡터 사이의 각도를 기반으로 방향이 얼마나 비슷한지를 측정하며, 문서 검색이나 추천 시스템에서 주로 사용됩니다.",
        isExam: true
    }
];

function main() {
    console.log("Reading db.json...");
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    const categories = JSON.parse(rawData);

    // Find 'data-analysis' category
    const category = categories.find((c: any) => c.id === 'data-analysis');
    if (!category) {
        console.error('Category data-analysis not found!');
        process.exit(1);
    }

    // Assign IDs: find max ID in current category
    let maxId = 0;
    category.questions.forEach((q: any) => {
        if (q.id > maxId) maxId = q.id;
    });

    // Append new questions
    newQuestions.forEach(q => {
        maxId++;
        category.questions.push({
            id: maxId,
            ...q
        });
    });

    console.log(`Added ${newQuestions.length} questions to data-analysis in db.json`);

    fs.writeFileSync(DB_PATH, JSON.stringify(categories, null, 2), 'utf8');
    console.log("db.json updated successfully.");
}

main();
