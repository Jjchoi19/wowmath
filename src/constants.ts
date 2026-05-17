import { GradeContent } from "./types";

export const MATH_CONTENT: GradeContent[] = [
  {
    grade: "초등학교 (1~2학년)",
    units: [
      {
        title: "1. 수의 이해",
        types: [
          { id: "e12-1", title: "9까지의 수와 네 자리 수" },
          { id: "e12-2", title: "수의 순서와 크기 비교" }
        ]
      },
      {
        title: "2. 덧셈과 뺄셈 기초",
        types: [
          { id: "e12-3", title: "받아올림 없는 덧셈/뺄셈" },
          { id: "e12-4", title: "받아올림 있는 덧셈/뺄셈" }
        ]
      },
      {
        title: "3. 도형의 기초",
        types: [
          { id: "e12-5", title: "여러 가지 평면 모양" },
          { id: "e12-6", title: "여러 가지 입체 모양" }
        ]
      },
      {
        title: "4. 측정과 시간",
        types: [
          { id: "e12-7", title: "길이 재기" },
          { id: "e12-8", title: "시각과 시간 알기" }
        ]
      },
      {
        title: "5. 곱셈의 기초",
        types: [
          { id: "e12-9", title: "곱셈의 개념" },
          { id: "e12-10", title: "구구단 (곱셈구구)" }
        ]
      },
      {
        title: "6. 규칙성과 자료",
        types: [
          { id: "e12-11", title: "규칙 찾기" },
          { id: "e12-12", title: "분류하기와 표" }
        ]
      }
    ]
  },
  {
    grade: "초등학교 (3~4학년)",
    units: [
      {
        title: "1. 큰 수와 수체계",
        types: [
          { id: "e34-1", title: "만, 억, 조 단위 큰 수" },
          { id: "e34-2", title: "수의 뛰어 세기" }
        ]
      },
      {
        title: "2. 연산 심화",
        types: [
          { id: "e34-3", title: "세 자리 수의 곱셈" },
          { id: "e34-4", title: "나눗셈의 기초와 응용" }
        ]
      },
      {
        title: "3. 분수와 소수 기초",
        types: [
          { id: "e34-5", title: "분수의 이해와 크기" },
          { id: "e34-6", title: "소수의 이해와 덧셈/뺄셈" }
        ]
      },
      {
        title: "4. 평면도형과 각도",
        types: [
          { id: "e34-7", title: "각도의 측정과 합/차" },
          { id: "e34-8", title: "삼각형과 사각형의 성질" }
        ]
      },
      {
        title: "5. 측정과 어림",
        types: [
          { id: "e34-9", title: "무게와 들이 측정" },
          { id: "e34-10", title: "수의 범위와 어림하기" }
        ]
      },
      {
        title: "6. 자료와 그래프",
        types: [
          { id: "e34-11", title: "막대그래프" },
          { id: "e34-12", title: "꺾은선그래프" }
        ]
      }
    ]
  },
  {
    grade: "초등학교 (5~6학년)",
    units: [
      {
        title: "1. 수의 성질",
        types: [
          { id: "e56-1", title: "약수와 배수" },
          { id: "e56-2", title: "약분과 통분" }
        ]
      },
      {
        title: "2. 분수/소수 사칙연산",
        types: [
          { id: "e56-3", title: "분수의 곱셈과 나눗셈" },
          { id: "e56-4", title: "소수의 곱셈과 나눗셈" }
        ]
      },
      {
        title: "3. 비와 비율",
        types: [
          { id: "e56-5", title: "비와 비율의 개념" },
          { id: "e56-6", title: "비례식과 비례배분" }
        ]
      },
      {
        title: "4. 평면도형의 넓이",
        types: [
          { id: "e56-7", title: "다각형의 둘레와 넓이" },
          { id: "e56-8", title: "원의 넓이와 원주율" }
        ]
      },
      {
        title: "5. 입체도형과 부피",
        types: [
          { id: "e56-9", title: "직육면체의 겉넓이와 부피" },
          { id: "e56-10", title: "원기둥, 원뿔, 구" }
        ]
      },
      {
        title: "6. 자료의 정리",
        types: [
          { id: "e56-11", title: "평균과 가능성" },
          { id: "e56-12", title: "여러 가지 그래프 해석" }
        ]
      }
    ]
  },
  {
    grade: "중학교 1학년",
    units: [
      {
        title: "1. 수의 체계",
        types: [
          { id: "m1-1", title: "소인수분해" },
          { id: "m1-2", title: "정수와 유리수" }
        ]
      },
      {
        title: "2. 문자와 식",
        types: [
          { id: "m1-3", title: "문자의 사용과 식의 계산" },
          { id: "m1-4", title: "일차방정식" }
        ]
      },
      {
        title: "3. 함수와 그래프",
        types: [
          { id: "m1-5", title: "좌표평면과 그래프" },
          { id: "m1-6", title: "정비례와 반비례" }
        ]
      },
      {
        title: "4. 기본 도형",
        types: [
          { id: "m1-7", title: "점, 선, 면과 각" },
          { id: "m1-8", title: "위치 관계와 평행선" }
        ]
      },
      {
        title: "5. 평면과 입체",
        types: [
          { id: "m1-9", title: "다각형과 원/부채꼴" },
          { id: "m1-10", title: "입체도형의 겉넓이와 부피" }
        ]
      },
      {
        title: "6. 통계",
        types: [
          { id: "m1-11", title: "도수분포표와 히스토그램" },
          { id: "m1-12", title: "상대도수" }
        ]
      }
    ]
  },
  {
    grade: "중학교 2학년",
    units: [
      {
        title: "1. 유리수와 소수",
        types: [
          { id: "m2-1", title: "유리수와 순환소수" },
          { id: "m2-2", title: "순환소수의 분수 표현" }
        ]
      },
      {
        title: "2. 식의 계산",
        types: [
          { id: "m2-3", title: "단항식의 계산" },
          { id: "m2-4", title: "다항식의 계산" }
        ]
      },
      {
        title: "3. 부등식과 방정식",
        types: [
          { id: "m2-5", title: "일차부등식" },
          { id: "m2-6", title: "연립일차방정식" }
        ]
      },
      {
        title: "4. 일차함수",
        types: [
          { id: "m2-7", title: "일차함수와 그래프" },
          { id: "m2-8", title: "일차함수와 일차방정식" }
        ]
      },
      {
        title: "5. 도형의 성질",
        types: [
          { id: "m2-9", title: "삼각형의 성질" },
          { id: "m2-10", title: "사각형의 성질" }
        ]
      },
      {
        title: "6. 닮음과 확률",
        types: [
          { id: "m2-11", title: "도형의 닮음" },
          { id: "m2-12", title: "피타고라스 정리와 확률" }
        ]
      }
    ]
  },
  {
    grade: "중학교 3학년",
    units: [
      {
        title: "1. 실수와 그 계산",
        types: [
          { id: "m3-1", title: "제곱근과 실수" },
          { id: "m3-2", title: "근호를 포함한 식의 계산" }
        ]
      },
      {
        title: "2. 식의 인수분해",
        types: [
          { id: "m3-3", title: "다항식의 곱셈" },
          { id: "m3-4", title: "인수분해의 기초와 응용" }
        ]
      },
      {
        title: "3. 이차방정식",
        types: [
          { id: "m3-5", title: "이차방정식의 풀이" },
          { id: "m3-6", title: "이차방정식의 활용" }
        ]
      },
      {
        title: "4. 이차함수",
        types: [
          { id: "m3-7", title: "이차함수의 그래프 (1)" },
          { id: "m3-8", title: "이차함수의 그래프 (2)" }
        ]
      },
      {
        title: "5. 기하",
        types: [
          { id: "m3-9", title: "삼각비" },
          { id: "m3-10", title: "원의 성질" }
        ]
      },
      {
        title: "6. 통계",
        types: [
          { id: "m3-11", title: "대푯값과 산포도" },
          { id: "m3-12", title: "상관관계" }
        ]
      }
    ]
  },
  {
    grade: "고등학교 1학년 (공통수학)",
    units: [
      {
        title: "1. 다항식",
        types: [
          { id: "h1-1", title: "다항식의 연산" },
          { id: "h1-2", title: "나머지 정리와 인수분해" }
        ]
      },
      {
        title: "2. 방정식과 부등식",
        types: [
          { id: "h1-3", title: "복소수와 이차방정식" },
          { id: "h1-4", title: "이차부등식과 연립방정식" }
        ]
      },
      {
        title: "3. 도형의 방정식",
        types: [
          { id: "h1-5", title: "평면좌표와 직선" },
          { id: "h1-6", title: "원의 방정식과 이동" }
        ]
      },
      {
        title: "4. 집합과 명제",
        types: [
          { id: "h1-7", title: "집합의 뜻과 연산" },
          { id: "h1-8", title: "명제와 증명" }
        ]
      },
      {
        title: "5. 함수",
        types: [
          { id: "h1-9", title: "함수의 합성/역함수" },
          { id: "h1-10", title: "유리함수와 무리함수" }
        ]
      },
      {
        title: "6. 순열과 조합",
        types: [
          { id: "h1-11", title: "경우의 수" },
          { id: "h1-12", title: "순열과 조합" }
        ]
      }
    ]
  },
  {
    grade: "고등학교 (수학 I / II)",
    units: [
      {
        title: "1. 지수와 로그",
        types: [
          { id: "h1-1-1", title: "지수와 로그" },
          { id: "h1-1-2", title: "지수함수와 로그함수" }
        ]
      },
      {
        title: "2. 삼각함수",
        types: [
          { id: "h1-1-3", title: "삼각함수의 정의와 그래프" },
          { id: "h1-1-4", title: "사인/코사인 법칙" }
        ]
      },
      {
        title: "3. 수열",
        types: [
          { id: "h1-1-5", title: "등차/등비수열" },
          { id: "h1-1-6", title: "수열의 합과 귀납법" }
        ]
      },
      {
        title: "4. 극한과 연속",
        types: [
          { id: "h1-2-1", title: "함수의 극한" },
          { id: "h1-2-2", title: "함수의 연속" }
        ]
      },
      {
        title: "5. 미분법",
        types: [
          { id: "h1-2-3", title: "미분계수와 도함수" },
          { id: "h1-2-4", title: "도함수의 활용" }
        ]
      },
      {
        title: "6. 적분법",
        types: [
          { id: "h1-2-5", title: "부정적분과 정적분" },
          { id: "h1-2-6", title: "정적분의 활용" }
        ]
      }
    ]
  },
  {
    grade: "고등학교 선택과목 (미적분/확통/기하)",
    units: [
      {
        title: "1. 수열의 극한",
        types: [
          { id: "he-1", title: "수열의 극한" },
          { id: "he-2", title: "급수" }
        ]
      },
      {
        title: "2. 초월함수 미적분",
        types: [
          { id: "he-3", title: "여러 가지 미분법" },
          { id: "he-4", title: "여러 가지 적분법" }
        ]
      },
      {
        title: "3. 경우의 수",
        types: [
          { id: "he-5", title: "여러 가지 순열" },
          { id: "he-6", title: "중복조합과 이항정리" }
        ]
      },
      {
        title: "4. 확률과 통계",
        types: [
          { id: "he-7", title: "조건부확률" },
          { id: "he-8", title: "통계적 추정" }
        ]
      },
      {
        title: "5. 이차곡선",
        types: [
          { id: "he-9", title: "이차곡선의 정의" },
          { id: "he-10", title: "이차곡선과 직선" }
        ]
      },
      {
        title: "6. 벡터와 입체",
        types: [
          { id: "he-11", title: "평면벡터" },
          { id: "he-12", title: "공간도형과 공간좌표" }
        ]
      }
    ]
  }
];
