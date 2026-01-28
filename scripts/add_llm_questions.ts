
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

const questions = [
    {
        text: "Word2Vec과 같은 임베딩 기술의 주된 목적은?",
        options: [
            "텍스트의 오타 수정 및 자동 교정",
            "단어의 의미를 벡터(숫자)로 변환하여 컴퓨터가 이해하도록 함",
            "텍스트 데이터를 암호화하여 보안 유지",
            "문장의 문법 오류를 실시간으로 검사",
            "텍스트 데이터를 압축하여 저장 공간 확보"
        ],
        correctIndex: 1,
        explanation: "임베딩은 자연어(텍스트)를 컴퓨터가 계산할 수 있는 수치 형태인 고차원 벡터로 변환하는 기술입니다. 이 과정에서 비슷한 의미를 가진 단어들은 벡터 공간에서 서로 가까운 위치에 배치됩니다.",
        isExam: true
    },
    {
        text: "트랜스포머(Transformer) 모델의 핵심 메커니즘으로, 문장 내 단어들의 관계를 계산하는 것은?",
        options: [
            "Convolution (합성곱)",
            "Max Pooling (맥스 풀링)",
            "Self-Attention (셀프 어텐션)",
            "Recurrent Neural Network (순환 신경망)",
            "Backpropagation (역전파)"
        ],
        correctIndex: 2,
        explanation: "Self-Attention은 문장 내의 각 단어가 서로 어떤 관련이 있는지 점수를 매겨 중요한 정보에 집중하게 만드는 메커니즘입니다. 이를 통해 문맥을 매우 효과적으로 파악할 수 있습니다.",
        isExam: true
    },
    {
        text: "트랜스포머 구조에서 입력 문장의 의미를 파악하고 벡터로 변환하는 역할을 주로 하는 부분은?",
        options: [
            "Encoder (인코더)",
            "Decoder (디코더)",
            "Generator (생성기)",
            "Discriminator (판별기)",
            "Classifier (분류기)"
        ],
        correctIndex: 0,
        explanation: "인코더는 입력된 정보를 받아 의미를 추출하고 수치화(임베딩)하는 데 특화되어 있습니다. 반대로 디코더는 인코더가 만든 정보를 바탕으로 새로운 문장을 생성하는 역할을 수행합니다.",
        isExam: true
    },
    {
        text: "GPT 모델은 트랜스포머의 어떤 부분을 주로 사용하는가?",
        options: [
            "Encoder만 사용",
            "Decoder만 사용",
            "Encoder와 Decoder를 교차로 사용",
            "둘 다 사용하지 않고 새로운 구조 사용",
            "오직 Self-Attention 레이어만 단독 사용"
        ],
        correctIndex: 1,
        explanation: "GPT는 'Generative Pre-trained Transformer'의 약자로, 다음 단어를 예측하며 문장을 만들어내는 '생성'에 특화된 모델입니다. 따라서 트랜스포머의 구조 중 생성에 최적화된 디코더 구조를 기반으로 합니다.",
        isExam: true
    },
    {
        text: "BERT 모델의 특징으로 옳은 것은?",
        options: [
            "단방향(왼쪽에서 오른쪽)으로만 문맥을 학습한다.",
            "주로 긴 문장을 요약하고 생성하는 데 사용된다.",
            "트랜스포머의 인코더 구조를 기반으로 양방향 문맥을 이해한다.",
            "순차적으로 데이터를 처리하여 RNN보다 속도가 느리다.",
            "이미지 인식 분야에서 가장 먼저 고안된 모델이다."
        ],
        correctIndex: 2,
        explanation: "BERT는 문장의 앞뒤 문맥을 동시에 고려하는 양방향(Bi-directional) 학습을 수행합니다. 트랜스포머의 인코더를 활용하며, 문맥 이해도가 높아 질문 답변이나 분류 문제에 강점이 있습니다.",
        isExam: true
    },
    {
        text: "트랜스포머는 병렬 처리를 위해 순서 정보가 사라지는 문제를 해결하고자 무엇을 사용하는가?",
        options: [
            "Word Embedding",
            "Positional Encoding (포지셔널 인코딩)",
            "Tokenization",
            "Layer Normalization",
            "Dropout"
        ],
        correctIndex: 1,
        explanation: "트랜스포머는 RNN처럼 단어를 순차적으로 입력받지 않고 한꺼번에 처리합니다. 이때 단어의 위치(순서) 정보를 알려주기 위해 벡터 값에 위치 정보를 더해주는 '포지셔널 인코딩' 기법을 사용합니다.",
        isExam: true
    },
    {
        text: "다음 중 토큰화(Tokenization)에 대한 설명으로 옳은 것은?",
        options: [
            "텍스트를 무조건 글자(Character) 단위로 자르는 것이다.",
            "텍스트를 모델이 처리 가능한 작은 단위(토큰)로 나누는 과정이다.",
            "텍스트를 문장 단위로 합쳐서 데이터를 정제하는 과정이다.",
            "이미지 데이터를 픽셀로 변환하여 신경망에 넣는 것이다.",
            "단어의 의미를 수치화하여 벡터 공간에 투영하는 것이다."
        ],
        correctIndex: 1,
        explanation: "토큰화는 자연어 처리를 위한 첫 단계로, 문장을 단어, 형태소, 혹은 서브워드(Subword) 단위로 쪼개어 모델이 이해할 수 있는 최소 단위인 '토큰'으로 만드는 작업입니다.",
        isExam: true
    },
    {
        text: "LLM이 문장을 생성하는 주된 방식은?",
        options: [
            "문장 전체를 한 번에 통째로 생성",
            "확률적으로 가장 적절한 '다음 토큰'을 하나씩 예측 (Next Token Prediction)",
            "데이터베이스에서 미리 저장된 유사 문장을 검색하여 출력",
            "문법 규칙에 따라 단어를 무작위로 조합",
            "입력된 문장을 그대로 복사하여 출력"
        ],
        correctIndex: 1,
        explanation: "현재의 거대언어모델(LLM)은 이전에 나온 단어들을 바탕으로 그다음에 올 단어(토큰)가 무엇일지 확률적으로 계산하여 순차적으로 이어 붙이는 방식으로 문장을 완성합니다.",
        isExam: true
    },
    {
        text: "'Attention is All You Need' 논문이 발표된 연도는? (트랜스포머의 등장)",
        options: [
            "2012년",
            "2015년",
            "2017년",
            "2019년",
            "2020년"
        ],
        correctIndex: 2,
        explanation: "구글 연구팀이 2017년에 발표한 이 논문은 기존의 RNN이나 CNN 없이 오직 Attention 메커니즘만으로도 뛰어난 성능을 낼 수 있음을 증명하며 생성형 AI 시대를 열었습니다.",
        isExam: true
    },
    {
        text: "RNN 대비 트랜스포머의 가장 큰 장점은?",
        options: [
            "모델의 파라미터 수가 훨씬 적어 가볍다.",
            "적은 양의 데이터로도 완벽하게 학습이 가능하다.",
            "긴 문맥 처리에 강하고 병렬 연산이 가능하여 학습 속도가 빠르다.",
            "이미지 데이터 처리에 있어 CNN보다 항상 우월하다.",
            "하드웨어 리소스를 거의 사용하지 않는다."
        ],
        correctIndex: 2,
        explanation: "RNN은 데이터를 순차적으로 처리해야 하므로 병렬화가 어렵고 긴 문장 뒤쪽으로 갈수록 앞의 정보를 잊어버리는 문제가 있습니다. 트랜스포머는 전체 문장을 한 번에 처리(병렬화)하여 이 문제를 획기적으로 해결했습니다.",
        isExam: true
    }
];

async function main() {
    console.log("Adding 10 LLM Basic exam questions...");

    // 1. Add to Database
    for (const q of questions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                categoryId: 'llm-basics',
                isExam: true
            }
        });
        console.log(`[DB] Added: ${q.text.substring(0, 20)}...`);
    }

    // 2. Add to db.json
    console.log("Syncing to db.json...");
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    const categories = JSON.parse(rawData);

    const category = categories.find((c: any) => c.id === 'llm-basics');
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
        console.log(`[JSON] Added ${questions.length} questions to llm-basics in db.json`);
    } else {
        console.error("Category llm-basics not found in db.json");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
