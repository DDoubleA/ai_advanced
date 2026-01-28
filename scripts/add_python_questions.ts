
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

const questions = [
    {
        text: "Python의 특징으로 옳지 않은 것은 무엇인가요?",
        options: ["인터프리터 언어이다.", "동적 타이핑을 지원한다.", "문법이 복잡하고 배우기 어렵다.", "방대한 라이브러리를 지원한다.", "AI 및 데이터 분석 분야에서 널리 사용된다."],
        correctIndex: 2,
        explanation: "Python은 문법이 간결하고 배우기 쉬운 것이 가장 큰 특징 중 하나입니다. 또한 방대한 라이브러리와 커뮤니티 지원 덕분에 AI와 머신러닝 개발에 널리 사용되는 범용 언어입니다.",
        isExam: true
    },
    {
        text: "다음 중 수정 불가능한(Immutable) 자료형은 무엇인가요?",
        options: ["List", "Dictionary", "Set", "Tuple", "Array"],
        correctIndex: 3,
        explanation: "Tuple은 소괄호 ()를 사용하여 데이터를 묶으며, 한 번 생성되면 내부의 값을 변경할 수 없는(Immutable) 성질을 가집니다. 반면 List는 대괄호 []를 사용하며 값 변경이 가능합니다 .",
        isExam: true
    },
    {
        text: "함수(Function) 정의 시 사용하는 키워드는 무엇인가요?",
        options: ["func", "define", "def", "function", "lambda"],
        correctIndex: 2,
        explanation: "Python에서 새로운 함수를 정의할 때는 def 키워드를 사용합니다. 함수의 기본 구조는 def 함수명(매개변수): 형태를 따릅니다 .",
        isExam: true
    },
    {
        text: "다음 코드의 실행 결과로 올바른 타입은 무엇인가요? print(type([]))",
        options: ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>", "<class 'int'>"],
        correctIndex: 1,
        explanation: "대괄호 [] 안에 값들을 나열하는 방식은 List(리스트) 자료형을 생성하는 문법입니다. 따라서 타입 확인 시 list 클래스로 출력됩니다 .",
        isExam: true
    },
    {
        text: "try-except 구문을 사용하는 주된 목적은 무엇인가요?",
        options: ["코드 실행 속도 향상", "예외 발생 시 프로그램 비정상 종료 방지", "메모리 사용량 감소", "무한 루프 생성", "데이터베이스 자동 연결"],
        correctIndex: 1,
        explanation: "예외 처리는 프로그램 실행 중 에러(Exception)가 발생했을 때 이를 포착하여 적절히 처리함으로써, 프로그램이 멈추지 않고 계속 실행될 수 있도록 방지하는 역할을 합니다 .",
        isExam: true
    },
    {
        text: "클래스 내에서 인스턴스 자신을 가리키는 첫 번째 매개변수의 관례적 이름은 무엇인가요?",
        options: ["this", "me", "self", "instance", "super"],
        correctIndex: 2,
        explanation: "Python의 클래스 메서드에서는 인스턴스 자신을 지칭하기 위해 self라는 키워드를 첫 번째 매개변수로 사용합니다. 이를 통해 인스턴스 변수에 접근할 수 있습니다 .",
        isExam: true
    },
    {
        text: "객체지향 프로그래밍에서 부모 클래스의 기능을 자식 클래스가 물려받는 것은 무엇인가요?",
        options: ["다형성 (Polymorphism)", "캡슐화 (Encapsulation)", "상속 (Inheritance)", "추상화 (Abstraction)", "최적화 (Optimization)"],
        correctIndex: 2,
        explanation: "상속(Inheritance)은 기존 클래스(부모)를 확장하여 새로운 클래스(자식)를 정의하는 개념입니다. 이를 통해 코드의 재사용성을 높일 수 있습니다 .",
        isExam: true
    },
    {
        text: "다음 중 Dictionary 자료형의 올바른 예시는 무엇인가요?",
        options: ["[]", "(1, 2, 3)", "{'name': 'Kim', 'age': 25}", "{1, 2, 3}", "'{\"name\": \"Kim\"}'"],
        correctIndex: 2,
        explanation: "Dictionary는 중괄호 {}를 사용하며, 키(Key)와 값(Value)이 콜론(:)으로 연결된 쌍(Key: Value)으로 데이터를 저장합니다 .",
        isExam: true
    },
    {
        text: "Python 가상 환경을 사용하는 이유로 가장 적절한 것은 무엇인가요?",
        options: ["파이썬 실행 속도를 높이기 위해", "프로젝트별로 독립적인 라이브러리 버전을 관리하기 위해", "하드웨어 성능을 최적화하기 위해", "코드를 암호화하기 위해", "소스 코드를 자동으로 생성하기 위해"],
        correctIndex: 1,
        explanation: "가상 환경은 프로젝트마다 독립적인 실행 환경을 만들어 줍니다. 이를 통해 프로젝트별로 서로 다른 버전의 라이브러리를 설치하더라도 충돌이 발생하지 않도록 관리할 수 있습니다.",
        isExam: true
    },
    {
        text: "__init__ 메서드의 역할은 무엇인가요?",
        options: ["클래스 소멸자", "클래스 생성자 (초기화)", "문자열 반환", "연산자 오버로딩", "모듈 임포트"],
        correctIndex: 1,
        explanation: "__init__ 메서드는 클래스의 인스턴스가 생성될 때 자동으로 호출되는 생성자(Constructor)입니다. 주로 객체의 속성(변수)을 초기화하는 데 사용됩니다 .",
        isExam: true
    }
];

async function main() {
    console.log("Adding 10 Python exam questions...");

    // 1. Add to Database
    for (const q of questions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                categoryId: 'python-basics',
                isExam: true
            }
        });
        console.log(`[DB] Added: ${q.text.substring(0, 20)}...`);
    }

    // 2. Add to db.json
    console.log("Syncing to db.json...");
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    const categories = JSON.parse(rawData);

    const category = categories.find((c: any) => c.id === 'python-basics');
    if (category) {
        // Find max ID to keep consistency locally
        let maxId = 0;
        category.questions.forEach((q: any) => {
            if (q.id > maxId) maxId = q.id;
        });

        questions.forEach(q => {
            maxId++;
            category.questions.push({
                id: maxId,
                ...q
            });
        });

        fs.writeFileSync(DB_PATH, JSON.stringify(categories, null, 2), 'utf8');
        console.log(`[JSON] Added ${questions.length} questions to python-basics in db.json`);
    } else {
        console.error("Category python-basics not found in db.json");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
