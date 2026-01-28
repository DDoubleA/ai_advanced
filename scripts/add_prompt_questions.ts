
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

const questions = [
    {
        text: "프롬프트 엔지니어링에서 'Few-Shot'이란 무엇인가?",
        options: [
            "모델을 새로운 데이터로 처음부터 다시 학습(Training)시키는 것",
            "프롬프트에 문제 해결 예시(Sample)를 몇 가지 함께 제공하는 것",
            "한 번에 오직 하나의 질문만 던져서 답변을 받는 것",
            "모델의 성능을 위해 가장 짧고 간결한 프롬프트를 작성하는 것",
            "답변의 길이를 특정 글자 수 이하로 제한하는 기법"
        ],
        correctIndex: 1,
        explanation: "Few-Shot은 모델에게 '질문-답변' 쌍의 예시를 몇 개 보여줌으로써, 모델이 사용자가 원하는 답변의 형식이나 논리를 빠르게 파악하도록 돕는 기법입니다. 예시가 아예 없으면 Zero-Shot, 하나만 있으면 One-Shot이라고 부릅니다.",
        isExam: true
    },
    {
        text: "복잡한 수학 문제나 논리 문제를 풀 때, 모델에게 중간 풀이 과정을 생성하도록 유도하여 정확도를 높이는 기법은?",
        options: [
            "Zero-Shot Prompting",
            "Chain of Thought (CoT, 사고의 사슬)",
            "Random Sampling",
            "Fine-Tuning (미세 조정)",
            "Data Augmentation (데이터 증강)"
        ],
        correctIndex: 1,
        explanation: "CoT는 모델이 최종 정답을 내놓기 전에 \"왜 그런 결과가 나왔는지\"에 대한 단계별 추론 과정을 스스로 쓰게 만드는 기법입니다. 이를 통해 복잡한 논리 오류를 줄일 수 있습니다.",
        isExam: true
    },
    {
        text: "\"Let's think step by step (단계별로 생각해 보자)\"라는 문구를 추가하여 추론 능력을 향상시키는 기법은?",
        options: [
            "Few-Shot CoT",
            "Zero-Shot CoT",
            "Meta Prompting",
            "RAG (검색 증강 생성)",
            "Iterative Refinement"
        ],
        correctIndex: 1,
        explanation: "별도의 예시(Shot)를 주지 않고도 \"단계별로 생각하라\"는 마법의 문구 하나만으로 모델이 논리적 추론을 수행하게 만드는 방식입니다. 예시가 없으므로 'Zero-Shot' CoT에 해당합니다.",
        isExam: true
    },
    {
        text: "프롬프트의 4대 구성 요소가 아닌 것은?",
        options: [
            "Persona (모델의 역할 부여)",
            "Task (수행해야 할 구체적 작업)",
            "Context (작업 수행에 필요한 배경 정보나 맥락)",
            "Learning Rate (학습률)",
            "Constraint (답변 시 지켜야 할 제약 사항)"
        ],
        correctIndex: 3,
        explanation: "페르소나, 작업, 맥락, 출력 형식(Format) 등이 프롬프트의 주요 구성 요소입니다. 반면 학습률(Learning Rate)은 모델을 '학습'시킬 때 사용하는 하이퍼파라미터이며, 프롬프트 작성 시에는 사용되지 않습니다.",
        isExam: true
    },
    {
        text: "LLM이 사실이 아닌 정보를 마치 사실인 것처럼 그럴싸하게 답변하는 현상은?",
        options: [
            "Overfitting (과적합)",
            "Hallucination (환각)",
            "Vanishing Gradient (기울기 소실)",
            "Tokenization (토큰화)",
            "Data Leakage (데이터 유출)"
        ],
        correctIndex: 1,
        explanation: "환각 현상은 모델이 학습 데이터에 없는 내용을 지어내거나, 확률적으로 그럴듯한 단어를 이어 붙이다가 사실 관계를 틀리는 현상을 말합니다.",
        isExam: true
    },
    {
        text: "복잡한 작업을 한 번에 처리하지 않고, 여러 단계의 프롬프트로 나누어 순차적으로 처리하는 기법은?",
        options: [
            "Prompt Chaining (프롬프트 체이닝)",
            "Batch Processing (배치 처리)",
            "Fine-Tuning (미세 조정)",
            "Vectorization (벡터화)",
            "Negative Prompting"
        ],
        correctIndex: 0,
        explanation: "하나의 큰 프롬프트에 모든 요구사항을 넣으면 모델이 혼란을 겪을 수 있습니다. 이를 단계별(예: 요약 -> 번역 -> 검토)로 쪼개어 앞 단계의 결과물을 다음 단계의 입력으로 사용하는 방식을 체이닝이라고 합니다.",
        isExam: true
    },
    {
        text: "Step-Back Prompting의 핵심 개념은?",
        options: [
            "질문을 최대한 짧고 간결하게 줄여서 전달한다.",
            "구체적인 답을 바로 요구하기 전에, 관련된 상위 개념이나 일반적인 원리를 먼저 질문한다.",
            "모델이 틀린 답을 했을 때 한 단계 이전 질문으로 돌아간다.",
            "답변을 영어로 번역한 후 다시 한국어로 번역하여 정확도를 높인다.",
            "모델의 답변을 무조건 한 번 거절하여 재검토하게 한다."
        ],
        correctIndex: 1,
        explanation: "'한 걸음 물러나기(Step-Back)' 기법은 구체적인 문제에 매몰되지 않도록 모델에게 관련 원칙이나 상위 개념을 먼저 상기시킨 후 문제를 풀게 하여 실수를 줄이는 고도화된 기법입니다.",
        isExam: true
    },
    {
        text: "다음 중 프롬프트 작성 팁으로 적절하지 않은 것은?",
        options: [
            "지시 사항을 명확하고 구체적이며 단정적으로 작성한다.",
            "표, 리스트, JSON 등 원하는 출력 형식을 명시해 준다.",
            "모델이 창의력을 발휘하도록 모호하고 추상적인 표현을 최대한 많이 사용한다.",
            "필요한 경우 \"너는 전문 마케터야\"와 같은 역할(Persona)을 부여한다.",
            "답변에 포함되지 말아야 할 '부정적 제약 조건'을 명시한다."
        ],
        correctIndex: 2,
        explanation: "프롬프트가 모호할수록 모델은 사용자의 의도를 파악하지 못해 엉뚱한 답을 내놓을 확률이 높습니다. 의도가 명확할수록 결과물의 품질이 안정적입니다.",
        isExam: true
    },
    {
        text: "LangChain에서 프롬프트 템플릿(Prompt Template)을 사용하는 주요 이유는?",
        options: [
            "프롬프트 구조를 정형화하여 재사용성을 높이고 변수 입력 처리를 자동화하기 위해",
            "모델 내부의 가중치를 직접 수정하여 학습 속도를 높이기 위해",
            "인터넷 연결이 없는 오프라인 환경에서 LLM을 구동하기 위해",
            "파이썬 문법을 사용하지 않고 영어로만 코딩하기 위해",
            "모델의 토큰 사용량을 강제로 0으로 만들기 위해"
        ],
        correctIndex: 0,
        explanation: "템플릿을 사용하면 고정된 지시문 안에 사용자 입력값(변수)만 갈아 끼우며 대량의 작업을 효율적으로 처리할 수 있어 개발 생산성이 향상됩니다.",
        isExam: true
    },
    {
        text: "최근 LLM 모델들이 시스템 프롬프트의 'Persona(역할 부여)' 없이도 성능이 잘 나오는 이유는?",
        options: [
            "모델 자체가 대규모 지시사항 학습(Instruction Tuning)을 통해 범용적인 수행 능력을 갖췄기 때문",
            "최신 모델에서는 역할 부여 기능이 시스템적으로 차단되었기 때문",
            "프롬프트의 길이가 일정 수준보다 길어지면 모델이 인식을 못 하기 때문",
            "역할 부여는 애초에 심리적 효과일 뿐 기술적 효과가 없었기 때문",
            "사용자가 역할을 부여하는 대신 AI가 사용자에게 역할을 부여하는 시대가 되었기 때문"
        ],
        correctIndex: 0,
        explanation: "최신 모델들은 수많은 프롬프트와 역할 예시를 통해 이미 충분히 학습(Meta-learning/Instruction-tuning)되었기 때문에, 아주 복잡한 역할 설정이 없어도 문맥만으로 사용자의 의도를 충분히 파악할 수 있을 만큼 영리해졌습니다.",
        isExam: true
    }
];

async function main() {
    console.log("Adding 10 Prompt Engineering exam questions...");

    // 1. Add to Database
    for (const q of questions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                categoryId: 'prompt-engineering',
                isExam: true
            }
        });
        console.log(`[DB] Added: ${q.text.substring(0, 20)}...`);
    }

    // 2. Add to db.json
    console.log("Syncing to db.json...");
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    const categories = JSON.parse(rawData);

    const category = categories.find((c: any) => c.id === 'prompt-engineering');
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
        console.log(`[JSON] Added ${questions.length} questions to prompt-engineering in db.json`);
    } else {
        console.error("Category prompt-engineering not found in db.json");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
