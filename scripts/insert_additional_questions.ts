
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
    {
        categoryId: 'rag-agent',
        text: "코사인 유사도(Cosine Similarity)를 계산할 때, 이 값이 나타내는 두 벡터의 핵심 특성은 무엇인가요?",
        options: ["두 벡터 사이의 직선거리 (L2 거리)", "두 벡터가 가리키는 방향의 유사성 (사잇각)", "두 벡터의 절대적인 크기(Magnitude)", "두 벡터의 합집합 크기", "두 벡터가 포함하는 데이터의 개수"],
        correctIndex: 1,
        explanation: "소스에 따르면 코사인 유사도는 두 벡터가 이루는 각도를 기반으로 유사성을 측정하며, 벡터의 크기보다는 방향이 얼마나 일치하는지를 나타냅니다."
    },
    {
        categoryId: 'data-analysis',
        text: "Python 데이터 분석 라이브러리 Pandas의 두 가지 핵심 데이터 구조는 무엇인가요? (※ 외부 지식 포함)",
        options: ["List, Dictionary", "Array, Matrix", "Series, DataFrame", "Tuple, Set", "Stack, Queue"],
        correctIndex: 2,
        explanation: "Pandas의 가장 기본이 되는 데이터 구조는 1차원 배열 형태의 Series와 2차원 표 형태의 DataFrame입니다 (소스 외 일반 AI 지식)."
    },
    {
        categoryId: 'rag-agent',
        text: "Agentic RAG의 핵심 아이디어로 가장 적절한 것은 무엇인가요?",
        options: ["검색 없이 LLM의 내부 지식만으로 답변하는 것", "단순히 검색된 문서의 Top K를 나열하여 보여주는 것", "검색 결과를 평가하고 논리에 따라 작업 흐름(Workflow)을 분기하는 것", "모델의 파라미터를 실시간으로 재학습시키는 것", "모든 문서를 요약하여 하나의 벡터로 만드는 것"],
        correctIndex: 2,
        explanation: "Agentic RAG는 검색된 결과를 평가(Evaluator)하고, 그 결과가 적절한지에 따라 검색 조건을 변경하거나 답변 작성을 결정하는 등 자율적인 워크플로우를 가집니다."
    },
    {
        categoryId: 'llm-basics',
        text: "LLM의 파라미터 가중치를 16비트에서 8비트 등으로 낮추어 모델 크기와 계산량을 줄이는 기술은? (※ 외부 지식 포함)",
        options: ["Normalization (정규화)", "Tokenization (토큰화)", "Quantization (양자화)", "Augmentation (증강)", "Regularization (규제화)"],
        correctIndex: 2,
        explanation: "가중치의 정밀도를 낮추어 효율성을 높이는 기술을 **양자화(Quantization)**라고 합니다 (소스 외 일반 AI 지식)."
    },
    {
        categoryId: 'llm-basics',
        text: "GPT-4와 같이 전체 파라미터 중 일부만 활성화하여 계산 효율을 높이는 아키텍처는 무엇인가요? (※ 외부 지식 포함)",
        options: ["CNN (Convolutional Neural Network)", "RNN (Recurrent Neural Network)", "MoE (Mixture of Experts)", "GAN (Generative Adversarial Network)", "LSTM (Long Short-Term Memory)"],
        correctIndex: 2,
        explanation: "MoE(전문가 혼합) 구조는 특정 입력에 대해 필요한 전문가(파라미터 그룹)들만 활성화하여 연산량을 최적화합니다 (소스 외 일반 AI 지식)."
    },
    {
        categoryId: 'rag-agent',
        text: "RAG 파이프라인의 Searching 단계에서, 단어의 표면적 일치가 아닌 '의미적 유사성'을 기반으로 검색하는 방식은?",
        options: ["Lexical Search (키워드 검색)", "BM25 Search", "Semantic Search (시멘틱 검색)", "SQL Query Search", "Exact Match Search"],
        correctIndex: 2,
        explanation: "Semantic Search는 임베딩 벡터 간의 유사도를 비교하여 질문과 의미적으로 가장 가까운 데이터를 탐색합니다."
    },
    {
        categoryId: 'llm-basics',
        text: "LLM의 토큰화(Tokenization) 과정에 대한 설명으로 가장 적절한 것은?",
        options: ["모든 단어는 1글자당 1토큰으로 변환된다.", "한국어는 영어보다 토큰 효율성이 항상 높다.", "모델마다 사용하는 토크나이저에 따라 동일 문장도 토큰 수와 분리 방식이 다를 수 있다.", "토큰화는 텍스트를 이미지로 변환하는 과정이다.", "토큰 수가 많아질수록 비용과 생성 속도 면에서 유리해진다."],
        correctIndex: 2,
        explanation: "소스 예시(GPT-3.5 vs GPT-4o)에서 보듯, 모델에 따라 동일한 단어도 토큰 분리 방식과 개수가 다릅니다."
    },
    {
        categoryId: 'rag-agent',
        text: "Small2Big과 Sliding Window 전략의 공통적인 목적은 무엇인가요?",
        options: ["데이터베이스의 저장 용량을 최소화하기 위해", "검색은 정밀하게 하되, LLM에게는 풍부한 문맥(Context)을 제공하기 위해", "모델의 학습 속도를 높이기 위해", "답변의 길이를 최대한 짧게 줄이기 위해", "외부 도구 사용(Tool Calling) 횟수를 늘리기 위해"],
        correctIndex: 1,
        explanation: "두 전략 모두 작은 단위(Small Chunk)로 정확하게 검색하고, 실제 LLM 답변 생성 시에는 주변 맥락(Parent Chunk 등)을 확장하여 포함시킴으로써 답변의 정확도를 높입니다."
    },
    {
        categoryId: 'rag-agent',
        text: "LLM 기반 에이전트가 생각(Reasoning) -> 행동(Acting) -> 관찰(Observation)의 과정을 반복하는 프레임워크는?",
        options: ["Reflexion", "ReAct", "CoT (Chain-of-Thought)", "Few-shot", "Step-back"],
        correctIndex: 1,
        explanation: "ReAct는 Reasoning과 Acting을 결합하여, 에이전트가 스스로 생각하고 행동하며 결과를 관찰하는 순환 과정을 통해 문제를 해결합니다."
    },
    {
        categoryId: 'rag-agent',
        text: "LLM의 Tool Schema에 대한 설명으로 잘못된 것은?",
        options: ["LLM에게 사용 가능한 도구의 기능을 설명하는 문서 역할을 한다.", "일반적으로 JSON과 동일한 형식을 사용하여 구조화된다.", "도구의 이름, 설명, 매개변수(Parameters) 정보가 포함된다.", "스키마를 통해 LLM이 직접 모델 파라미터를 수정할 수 있게 한다.", "System Prompt 등에 포함되어 LLM이 도구 사용 여부를 판단하게 돕는다."],
        correctIndex: 3,
        explanation: "Tool Schema는 LLM이 외부 도구를 **호출(Calling)**하기 위한 규격일 뿐, 모델의 파라미터를 직접 수정하게 하는 용도가 아닙니다."
    },
    {
        categoryId: 'fine-tuning',
        text: "RAG와 파인 튜닝(Fine-tuning)의 차이로 적절한 것은 무엇인가요?",
        options: ["RAG는 모델 내부의 지식을 바꾸는 방식이다.", "파인 튜닝은 외부 DB를 검색하여 답변을 생성한다.", "RAG는 지식의 업데이트가 실시간으로 가능하나, 파인 튜닝은 재학습 비용이 발생한다.", "파인 튜닝이 RAG보다 환각(Hallucination) 현상 해결에 더 효과적이다.", "RAG는 모델의 말투나 스타일을 교정하는 데 최적의 방법이다."],
        correctIndex: 2,
        explanation: "RAG는 외부 DB만 업데이트하면 최신 정보를 반영할 수 있지만, 파인 튜닝은 모델 파라미터를 변경하기 위해 학습 시간과 비용이 필요합니다."
    },
    {
        categoryId: 'fine-tuning',
        text: "LLM의 사전학습(Pre-training)과 파인 튜닝(Fine-tuning)의 차이에 대한 설명으로 가장 옳은 것은? (※ 외부 지식 포함)",
        options: ["사전학습은 소량의 도메인 데이터로 진행된다.", "파인 튜닝은 모델에게 기본적인 언어 구조를 가르치는 단계이다.", "사전학습은 방대한 양의 일반 지식을 학습하고, 파인 튜닝은 특정 작업이나 도메인에 최적화하는 단계이다.", "파인 튜닝 단계가 사전학습보다 훨씬 많은 연산 자원을 소모한다.", "사전학습이 끝나면 더 이상 모델의 가중치는 변경할 수 없다."],
        correctIndex: 2,
        explanation: "사전학습은 거대 데이터를 통한 범용 지식 습득, 파인 튜닝은 특정 목적에 맞는 미세 조정 단계입니다 (소스 외 일반 AI 지식)."
    },
    {
        categoryId: 'fine-tuning',
        text: "RLHF(사람 피드백 기반 강화학습)에서 보상 모델(Reward Model)의 역할은? (※ 외부 지식 포함)",
        options: ["사용자의 질문을 벡터로 변환하여 저장한다.", "모델이 생성한 답변이 사람의 선호도에 얼마나 부합하는지 점수를 매긴다.", "데이터베이스에서 관련 문서를 검색한다.", "텍스트를 여러 개의 토큰으로 쪼갠다.", "답변 생성 과정에서 외부 API를 호출한다."],
        correctIndex: 1,
        explanation: "보상 모델은 인간의 피드백을 학습하여, 언어 모델의 답변 품질을 평가하고 점수를 주는 기준 역할을 합니다 (소스 외 일반 AI 지식)."
    },
    {
        categoryId: 'rag-agent',
        text: "Tool Calling의 주요 목적은 무엇인가요?",
        options: ["LLM의 파라미터 수를 획기적으로 늘리기 위해", "텍스트 출력을 넘어 계산기, 웹 검색 등 실제 행동(Action)으로 연결하기 위해", "프롬프트의 길이를 최대한 길게 만들기 위해", "모델 학습 데이터를 외부 DB로 옮기기 위해", "모델의 창의성을 높여 환각 현상을 즐기기 위해"],
        correctIndex: 1,
        explanation: "Tool Calling은 LLM이 스스로 판단하여 외부 함수나 모듈을 실행함으로써 실제 과제를 수행하게 합니다."
    },
    {
        categoryId: 'prompt-engineering',
        text: "Step-back Prompting의 핵심 아이디어는 무엇인가요?",
        options: ["질문에 대해 즉시 답변을 생성하는 것", "정답을 생성하기 전, 문제를 추상화하여 필요한 핵심 요소와 구조를 먼저 도출하는 것", "답변이 틀렸을 때 이전 단계로 돌아가 다시 질문하는 것", "예시(Shot)를 수십 개 이상 제공하여 학습시키는 것", "답변의 형식을 표(Table) 형태로 고정하는 것"],
        correctIndex: 1,
        explanation: "복잡한 문제를 바로 풀기보다, 한 발 물러나서(Step-back) 전체 구획과 원리 등 필요한 요소를 먼저 정의한 뒤 답변을 생성하여 정확도를 높입니다."
    },
    {
        categoryId: 'rag-agent',
        text: "RAGAS 프레임워크가 제공하는 주요 평가 항목으로 적절한 것은 무엇인가요?",
        options: ["모델의 학습 시간 및 GPU 소모량", "검색의 관련성(Relevance) 및 답변의 성실성(Faithfulness) 등 RAG 성능 지표", "벡터 DB의 인덱싱 속도", "파인 튜닝 시 사용된 데이터의 개수", "에이전트의 도구 호출 성공 횟수"],
        correctIndex: 1,
        explanation: "RAGAS는 RAG 시스템의 성능을 평가하기 위해 검색(Retrieval)과 생성(Generation) 관점에서 다양한 매트릭을 적용할 수 있게 해주는 프레임워크입니다."
    }
];

async function main() {
    console.log("Adding new questions...");

    for (const q of questions) {
        await prisma.question.create({
            data: {
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation,
                categoryId: q.categoryId
            }
        });
        console.log(`Added: ${q.text.substring(0, 30)}...`);
    }

    console.log("All questions added successfully.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
