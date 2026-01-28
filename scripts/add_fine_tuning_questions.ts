
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

const questions = [
    {
        text: "Pre-trained 모델 전체를 학습하지 않고, 일부 파라미터만 추가하거나 선택적으로 학습하여 효율적으로 튜닝하는 기법의 통칭은 무엇입니까?",
        options: [
            "SFT (Supervised Fine-Tuning)",
            "RLHF (Reinforcement Learning from Human Feedback)",
            "PEFT (Parameter Efficient Fine-Tuning)",
            "CPT (Continuous Pre-Training)",
            "RAG (Retrieval-Augmented Generation)"
        ],
        correctIndex: 2,
        explanation: "PEFT는 거대 모델의 수십억 개 파라미터를 모두 수정하는 대신, 아주 적은 수의 파라미터만 추가하거나 업데이트함으로써 연산 자원과 메모리를 획기적으로 절약하며 모델을 최적화하는 기술들을 통칭합니다.",
        isExam: true
    },
    {
        text: "PEFT의 대표적인 알고리즘으로, 가중치 업데이트 시 행렬을 두 개의 저랭크(Low-Rank) 행렬로 분해하여 학습 파라미터 수를 줄이는 방식은?",
        options: [
            "PPO (Proximal Policy Optimization)",
            "LoRA (Low-Rank Adaptation)",
            "DPO (Direct Preference Optimization)",
            "BERT",
            "Adapter"
        ],
        correctIndex: 1,
        explanation: "LoRA는 기존 모델의 가중치는 고정(Freeze)한 채, 가중치의 변화량을 나타내는 행렬을 저랭크로 분해하여 학습하는 방식입니다. 이를 통해 학습이 필요한 파라미터 수를 1,000배 이상 줄이기도 합니다.",
        isExam: true
    },
    {
        text: "미세 조정(Fine-Tuning)을 수행할 때, 새로운 데이터를 학습하면서 모델이 이미 가지고 있던 기존의 일반적인 지식이나 능력을 잃어버리는 현상은?",
        options: [
            "Hallucination (환각)",
            "Overfitting (과적합)",
            "Catastrophic Forgetting (파괴적 망각)",
            "Vanishing Gradient (기울기 소실)",
            "Data Leakage (데이터 누출)"
        ],
        correctIndex: 2,
        explanation: "특정 도메인이나 작업에 맞춰 모델을 강하게 학습시킬 때, 사전 학습 과정에서 습득했던 범용적인 지식이 손상되어 기존에 잘하던 작업을 못 하게 되는 현상을 말합니다.",
        isExam: true
    },
    {
        text: "다음 중 미세 조정(Fine-Tuning)을 도입하기에 가장 적절한 상황은 무엇입니까?",
        options: [
            "실시간 주식 정보나 오늘의 날씨 정보를 답변해야 할 때",
            "모델에게 특정 병원의 진료 기록 작성 스타일이나 전문적인 말투를 내재화시키고 싶을 때",
            "단순히 두 수의 덧셈이나 곱셈 같은 산술 연산을 수행할 때",
            "전 세계의 일반적인 상식(예: 프랑스의 수도)을 물어볼 때",
            "외부 웹사이트의 최신 뉴스 기사를 요약해야 할 때"
        ],
        correctIndex: 1,
        explanation: "미세 조정은 모델의 말투, 출력 형식, 특수 도메인 지식의 내재화 등 모델의 '행동 패턴'을 바꾸는 데 매우 효과적입니다. 실시간 정보나 최신 데이터 반영에는 RAG가 더 유리합니다.",
        isExam: true
    },
    {
        text: "별도의 보상 모델(Reward Model) 없이, 선호 데이터(Good/Bad) 쌍만으로 모델을 인간의 선호에 맞게 정렬하는 효율적인 방식은?",
        options: [
            "PPO (Proximal Policy Optimization)",
            "SFT (Supervised Fine-Tuning)",
            "DPO (Direct Preference Optimization)",
            "CPT (Continuous Pre-Training)",
            "In-Context Learning"
        ],
        correctIndex: 2,
        explanation: "DPO는 복잡한 RLHF(강화 학습) 과정에서 보상 모델 학습과 PPO 알고리즘 단계를 생략하고, 직접적으로 데이터의 선호도를 학습하여 모델을 정렬하는 더 단순하고 효율적인 방식입니다.",
        isExam: true
    },
    {
        text: "RAG(검색 증강 생성)와 미세 조정(Fine-Tuning)의 차이점에 대한 설명으로 옳은 것은?",
        options: [
            "RAG는 모델의 내부 파라미터를 영구적으로 수정한다.",
            "미세 조정은 답변을 생성할 때마다 외부 데이터베이스를 검색한다.",
            "RAG는 최신 정보 반영에 유리하고, 미세 조정은 모델의 행동 패턴과 지식 내재화에 유리하다.",
            "두 기술은 완전히 동일한 원리로 작동하는 기술이다.",
            "미세 조정은 RAG보다 데이터 업데이트 비용이 훨씬 저렴하다."
        ],
        correctIndex: 2,
        explanation: "RAG는 외부 정보를 실시간으로 참조하여 답변하므로 정보 업데이트가 쉽고 할루시네이션을 줄이는 데 좋으며, 미세 조정은 모델 자체를 특정 목적에 맞춰 '체질 개선'을 하는 데 강점이 있습니다.",
        isExam: true
    },
    {
        text: "지도 미세 조정(SFT, Supervised Fine-Tuning)의 주된 학습 데이터 형태는 무엇입니까?",
        options: [
            "라벨이 없는 대규모 텍스트 뭉치 (Corpus)",
            "질문(Instruction)과 그에 대한 정답(Response) 쌍으로 구성된 데이터",
            "대량의 이미지와 텍스트 설명 데이터",
            "단순히 '좋음' 혹은 '싫음'으로 표시된 보상 점수",
            "모델이 스스로 생성한 오답 데이터"
        ],
        correctIndex: 1,
        explanation: "SFT는 특정 지시사항(Instruction)에 대해 모델이 어떻게 대답해야 하는지 모범 답안(Gold Standard)을 보여주며 학습시키는 단계입니다.",
        isExam: true
    },
    {
        text: "베이스 모델(Base Model)과 인스트럭트 모델(Instruct Model)의 주요 차이점은?",
        options: [
            "베이스 모델은 다음 단어 예측 위주로 학습되었고, 인스트럭트 모델은 지시사항을 따르도록 튜닝되었다.",
            "베이스 모델은 대화가 불가능하며 코딩 작업만 수행할 수 있다.",
            "인스트럭트 모델은 추가적인 학습 없이 프롬프트만으로 만들어진 모델이다.",
            "베이스 모델이 인스트럭트 모델보다 항상 더 안전한 답변을 생성한다.",
            "두 모델 사이에는 구조적, 기능적 차이가 전혀 없다."
        ],
        correctIndex: 0,
        explanation: "베이스 모델은 단순히 문장을 이어 나가는 능력에 집중되어 있지만, 여기에 SFT 등을 적용하여 사용자의 명령에 적절히 대답하도록 만든 것이 인스트럭트 모델입니다.",
        isExam: true
    },
    {
        text: "RLHF(인간 피드백 기반 강화 학습)의 핵심 구성 요소가 아닌 것은?",
        options: [
            "사전 학습된 언어 모델 (Pre-trained Model)",
            "보상 모델 (Reward Model)",
            "PPO (Proximal Policy Optimization) 알고리즘",
            "벡터 데이터베이스 (Vector Database)",
            "인간의 선호도가 반영된 비교 데이터"
        ],
        correctIndex: 3,
        explanation: "벡터 데이터베이스는 주로 RAG(검색 증강 생성) 환경에서 지식 검색을 위해 사용되는 도구입니다. RLHF는 모델의 답변 품질을 인간의 기준에 맞추는 '정렬' 과정에 집중합니다.",
        isExam: true
    },
    {
        text: "특정 도메인의 대량 코퍼스를 추가로 학습시켜 모델이 해당 분야의 기초 지식을 내재화하도록 강화하는 과정은?",
        options: [
            "프롬프트 엔지니어링 (Prompt Engineering)",
            "지속적 사전 학습 (CPT, Continuous Pre-Training)",
            "인컨텍스트 러닝 (In-Context Learning)",
            "제로샷 추론 (Zero-shot Inference)",
            "퓨샷 러닝 (Few-shot Learning)"
        ],
        correctIndex: 1,
        explanation: "CPT는 이미 학습된 모델에 의료, 법률 등 특정 분야의 방대한 텍스트 데이터를 추가로 학습시켜, 해당 도메인의 기본 언어 구조와 지식을 깊이 있게 익히게 하는 과정입니다.",
        isExam: true
    }
];

async function main() {
    console.log("Adding 10 Fine Tuning exam questions...");

    // 1. Add to Database
    for (const q of questions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                categoryId: 'fine-tuning',
                isExam: true
            }
        });
        console.log(`[DB] Added: ${q.text.substring(0, 20)}...`);
    }

    // 2. Add to db.json
    console.log("Syncing to db.json...");
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    const categories = JSON.parse(rawData);

    const category = categories.find((c: any) => c.id === 'fine-tuning');
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
        console.log(`[JSON] Added ${questions.length} questions to fine-tuning in db.json`);
    } else {
        console.error("Category fine-tuning not found in db.json");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
