'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

interface EducationPost {
  id: number;
  title: string;
  category: string;
  content: string;
  summary: string;
  date: string;
  views: number;
  importance: 'high' | 'medium' | 'low';
  tags: string[];
}

export default function EducationPage() {
  const [posts, setPosts] = useState<EducationPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<EducationPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const mockPosts: EducationPost[] = [
      {
        id: 1,
        title: '근로계약서 작성은 필수! 꼭 확인해야 할 항목',
        category: '근로계약',
        content: `근로계약서는 알바생의 권리를 보호하는 가장 기본적인 문서입니다.

**반드시 포함되어야 할 항목:**

1. **근로 시작일과 종료일**
   - 계약 기간이 명확히 명시되어야 합니다
   - 기간의 정함이 없는 경우도 명시 가능

2. **근무 장소와 업무 내용**
   - 구체적인 근무지 주소
   - 담당할 업무의 범위

3. **근로 시간과 휴게 시간**
   - 1일 근로시간
   - 주당 근로시간
   - 휴게시간 (4시간 근무 시 30분, 8시간 근무 시 1시간)

4. **임금과 지급 방법**
   - 시급 또는 월급
   - 급여 지급일
   - 지급 방법 (현금, 계좌이체 등)

5. **휴일과 휴가**
   - 주휴일
   - 연차휴가
   - 기타 휴가

**주의사항:**
- 근로계약서는 반드시 2부를 작성하여 각자 1부씩 보관
- 구두 약속만으로는 법적 효력이 약함
- 계약서 내용과 실제 근무 조건이 다르면 즉시 시정 요구`,
        summary: '근로계약서 작성 시 반드시 확인해야 할 필수 항목과 주의사항을 알아봅니다.',
        date: '2024-03-15',
        views: 1245,
        importance: 'high',
        tags: ['근로계약서', '필수확인', '권리보호']
      },
      {
        id: 2,
        title: '2024년 최저임금은 얼마? 내 급여 계산하기',
        category: '임금',
        content: `2024년 최저임금과 올바른 급여 계산 방법을 알아봅시다.

**2024년 최저임금:**
- 시간급: 9,860원
- 월 환산액: 2,060,740원 (주 40시간 기준)

**급여 계산 방법:**

1. **기본 시급 계산**
   - 근무시간 × 시급

2. **주휴수당**
   - 주 15시간 이상 근무 시 지급
   - 1주 근로시간 ÷ 40시간 × 8시간 × 시급

3. **연장근로수당**
   - 1주 40시간, 1일 8시간 초과 근무 시
   - 통상시급 × 1.5배

4. **야간근로수당**
   - 오후 10시 ~ 오전 6시 근무 시
   - 통상시급 × 0.5배 추가

5. **휴일근로수당**
   - 휴일 근무 시
   - 8시간 이내: 통상시급 × 1.5배
   - 8시간 초과: 통상시급 × 2배

**계산 예시:**
주 5일, 하루 4시간 근무 (주 20시간)
- 기본급: 20시간 × 9,860원 = 197,200원
- 주휴수당: 20시간 ÷ 40시간 × 8시간 × 9,860원 = 39,440원
- 월 급여: 197,200원 + 39,440원 = 236,640원 (주당)`,
        summary: '2024년 최저임금과 주휴수당, 연장수당 등 올바른 급여 계산 방법을 배웁니다.',
        date: '2024-03-14',
        views: 2156,
        importance: 'high',
        tags: ['최저임금', '급여계산', '주휴수당']
      },
      {
        id: 3,
        title: '부당해고 당했을 때 대처 방법',
        category: '해고',
        content: `부당하게 해고를 당했을 때 어떻게 대처해야 할까요?

**부당해고란?**
정당한 이유 없이 일방적으로 근로계약을 해지하는 것

**부당해고의 예:**
- 사전 통보 없는 즉시 해고
- 정당한 이유 없는 해고
- 해고 예고 수당 미지급
- 임신, 출산, 육아휴직 등을 이유로 한 해고

**대처 방법:**

1. **증거 확보**
   - 해고 통보 문자, 카톡 캡처
   - 근로계약서 사본
   - 급여명세서
   - 근무 기록

2. **해고 사유 서면 요청**
   - 해고 이유를 서면으로 요청
   - 사업주는 요청 시 반드시 교부해야 함

3. **노동청 진정**
   - 관할 지방고용노동청 방문
   - 부당해고 구제 신청
   - 해고일로부터 3개월 이내 신청

4. **노동위원회 구제 신청**
   - 해고일로부터 3개월 이내
   - 구제 명령 시 복직 또는 금전보상

**연락처:**
- 고용노동부 상담센터: 1350
- 근로복지공단: 1588-0075`,
        summary: '부당해고를 당했을 때 취할 수 있는 법적 대응 방법과 절차를 안내합니다.',
        date: '2024-03-13',
        views: 987,
        importance: 'high',
        tags: ['부당해고', '노동청', '권리구제']
      },
      {
        id: 4,
        title: '주휴수당, 나도 받을 수 있을까?',
        category: '임금',
        content: `주휴수당의 개념과 지급 조건을 알아봅시다.

**주휴수당이란?**
1주일 동안 정해진 근로일수를 개근한 근로자에게 유급 휴일을 주는 제도

**지급 조건:**
1. 주 15시간 이상 근무
2. 1주일 개근 (결근, 지각, 조퇴 없이)
3. 소정근로일 모두 출근

**계산 방법:**
1주 근로시간 ÷ 40시간 × 8시간 × 시급

**예시:**
- 주 20시간 근무, 시급 10,000원
- 20 ÷ 40 × 8 × 10,000 = 40,000원

**주의사항:**
- 주 15시간 미만 근무 시 주휴수당 없음
- 결근 시 해당 주 주휴수당 미지급
- 월급제도 주휴수당 포함되어 있음

**자주 묻는 질문:**

Q. 주 3일, 하루 5시간 근무하면?
A. 주 15시간이므로 주휴수당 받을 수 있음

Q. 주 5일, 하루 2시간 근무하면?
A. 주 10시간이므로 주휴수당 없음

Q. 하루 결근하면?
A. 해당 주는 주휴수당 받을 수 없음`,
        summary: '주휴수당의 개념, 지급 조건, 계산 방법을 상세히 설명합니다.',
        date: '2024-03-12',
        views: 1678,
        importance: 'high',
        tags: ['주휴수당', '급여', '근로시간']
      },
      {
        id: 5,
        title: '산업재해 발생 시 대처 방법',
        category: '산재',
        content: `일하다가 다쳤을 때 어떻게 해야 할까요?

**산업재해란?**
업무상 사유로 발생한 부상, 질병, 장해, 사망

**산재 인정 범위:**
- 업무 중 발생한 사고
- 출퇴근 중 사고
- 업무상 질병
- 직업병

**즉시 해야 할 일:**

1. **응급처치 및 병원 이동**
   - 안전한 장소로 이동
   - 119 신고 또는 병원 방문

2. **사업주에게 알리기**
   - 즉시 사고 사실 통보
   - 가능하면 서면으로 기록

3. **증거 확보**
   - 사고 현장 사진
   - 목격자 진술
   - CCTV 영상

**산재 신청 절차:**

1. **요양급여 신청**
   - 산재보험 의료기관 방문
   - 요양급여신청서 작성
   - 사업주 확인 필요 (거부 시 근로복지공단에 직접 신청)

2. **근로복지공단 승인**
   - 업무상 재해 여부 조사
   - 승인 시 치료비 전액 지원

3. **휴업급여 신청**
   - 요양으로 일하지 못한 경우
   - 평균임금의 70% 지급

**주의사항:**
- 일반 건강보험으로 치료받으면 산재 처리 어려움
- 반드시 산재보험 지정 병원에서 치료
- 사업주가 산재 신고 거부해도 본인이 직접 신청 가능

**문의:**
근로복지공단 1588-0075`,
        summary: '업무 중 다쳤을 때 산재 처리 방법과 보상 절차를 안내합니다.',
        date: '2024-03-11',
        views: 756,
        importance: 'medium',
        tags: ['산재', '안전', '보상']
      },
      {
        id: 6,
        title: '연차휴가 사용 권리와 수당',
        category: '휴가',
        content: `알바생도 연차휴가를 받을 수 있습니다!

**연차휴가 발생 조건:**

1. **1년 미만 근무자**
   - 1개월 개근 시 1일의 유급휴가
   - 최대 11일

2. **1년 이상 근무자**
   - 15일의 연차휴가
   - 2년마다 1일씩 가산 (최대 25일)

**계산 예시:**

6개월 근무, 매월 개근
- 6일의 연차휴가 발생

1년 근무, 80% 이상 출근
- 15일의 연차휴가 발생

**연차수당:**
- 사용하지 못한 연차는 수당으로 지급
- 1일 통상임금 × 미사용 연차일수

**주의사항:**
- 연차는 1년간 사용하지 않으면 소멸
- 사업주는 연차 사용을 방해할 수 없음
- 퇴사 시 미사용 연차는 수당으로 정산

**연차 사용 방법:**
1. 사전에 사용 날짜 통보
2. 사업주는 정당한 사유 없이 거부 불가
3. 사용하지 못하면 수당 청구`,
        summary: '알바생의 연차휴가 발생 조건과 연차수당 계산 방법을 설명합니다.',
        date: '2024-03-10',
        views: 1234,
        importance: 'medium',
        tags: ['연차', '휴가', '수당']
      },
      {
        id: 7,
        title: '4대 보험 가입 대상과 혜택',
        category: '보험',
        content: `알바생도 4대 보험에 가입할 수 있습니다.

**4대 보험이란?**
국민연금, 건강보험, 고용보험, 산재보험

**가입 대상:**

1. **국민연금**
   - 월 60시간 이상 근무
   - 만 18세 이상 60세 미만

2. **건강보험**
   - 월 60시간 이상 근무
   - 1개월 이상 근무 예정

3. **고용보험**
   - 주 15시간 이상 근무
   - 1개월 이상 근무 예정

4. **산재보험**
   - 모든 근로자 (근무시간 무관)
   - 1명이라도 근로자 고용 시 의무 가입

**보험료 부담:**
- 국민연금: 근로자 4.5%, 사업주 4.5%
- 건강보험: 근로자 3.545%, 사업주 3.545%
- 고용보험: 근로자 0.9%, 사업주 0.9%
- 산재보험: 사업주 100% 부담

**혜택:**

**국민연금**
- 노령연금
- 장애연금
- 유족연금

**건강보험**
- 의료비 지원
- 건강검진

**고용보험**
- 실업급여
- 출산전후휴가급여
- 육아휴직급여

**산재보험**
- 요양급여
- 휴업급여
- 장해급여

**확인 방법:**
4대사회보험 정보연계센터 (www.4insure.or.kr)에서 가입 여부 확인 가능`,
        summary: '알바생의 4대 보험 가입 조건과 각 보험의 혜택을 안내합니다.',
        date: '2024-03-09',
        views: 1456,
        importance: 'medium',
        tags: ['4대보험', '사회보험', '복지']
      },
      {
        id: 8,
        title: '임금 체불 시 대처 방법',
        category: '임금',
        content: `급여를 받지 못했을 때 어떻게 해야 할까요?

**임금 체불이란?**
정해진 날짜에 임금을 지급하지 않는 것

**대처 순서:**

1. **사업주에게 요청**
   - 서면으로 임금 지급 요청
   - 문자, 이메일 등 기록 남기기

2. **내용증명 발송**
   - 우체국에서 내용증명 발송
   - 법적 효력 있는 증거 확보

3. **노동청 진정**
   - 관할 지방고용노동청 방문
   - 임금체불 진정서 제출
   - 필요 서류: 근로계약서, 급여명세서, 통장사본 등

4. **체불임금 확인서 발급**
   - 노동청에서 확인서 발급
   - 은행 대출 시 활용 가능

5. **소액심판 또는 민사소송**
   - 3,000만원 이하: 소액심판
   - 3,000만원 초과: 민사소송

**체불임금 지원 제도:**

**체당금 제도**
- 사업주가 파산 등으로 임금 지급 불가 시
- 국가가 대신 지급
- 최대 1,100만원 (퇴직금 포함 최대 1,650만원)

**임금채권보장법**
- 최종 3개월분 임금
- 최종 3년간 퇴직금

**시효:**
- 임금: 3년
- 퇴직금: 3년

**연락처:**
- 고용노동부 상담센터: 1350
- 근로복지공단: 1588-0075

**주의사항:**
- 증거 자료 반드시 확보
- 시효 내에 청구
- 포기각서 절대 작성 금지`,
        summary: '급여를 받지 못했을 때 법적 대응 방법과 체불임금 지원 제도를 설명합니다.',
        date: '2024-03-08',
        views: 1890,
        importance: 'high',
        tags: ['임금체불', '노동청', '체당금']
      },
      {
        id: 9,
        title: '근로시간과 휴게시간 규정',
        category: '근로시간',
        content: `법으로 정해진 근로시간과 휴게시간을 알아봅시다.

**법정 근로시간:**

1. **1일 근로시간**
   - 8시간 이내
   - 당사자 합의 시 12시간까지 연장 가능

2. **1주 근로시간**
   - 40시간 이내
   - 당사자 합의 시 12시간까지 연장 가능

3. **15세 이상 18세 미만**
   - 1일 7시간, 1주 35시간
   - 당사자 합의 시 1일 1시간, 1주 5시간 연장 가능

**휴게시간:**

1. **4시간 근무**
   - 30분 이상 휴게시간

2. **8시간 근무**
   - 1시간 이상 휴게시간

3. **휴게시간 원칙**
   - 근로시간 도중에 부여
   - 자유롭게 이용 가능
   - 근로시간에서 제외

**휴일:**

1. **주휴일**
   - 1주일에 평균 1회 이상
   - 유급 휴일

2. **근로자의 날**
   - 5월 1일
   - 유급 휴일

**야간 및 휴일 근로:**

1. **야간근로**
   - 오후 10시 ~ 오전 6시
   - 통상임금의 50% 가산

2. **휴일근로**
   - 8시간 이내: 50% 가산
   - 8시간 초과: 100% 가산

**위반 시:**
- 2년 이하 징역 또는 2,000만원 이하 벌금
- 노동청에 신고 가능

**예외:**
- 5인 미만 사업장은 일부 규정 적용 제외
- 단, 최저임금, 연차휴가 등은 동일 적용`,
        summary: '법정 근로시간, 휴게시간, 휴일 규정과 위반 시 대처 방법을 안내합니다.',
        date: '2024-03-07',
        views: 1123,
        importance: 'medium',
        tags: ['근로시간', '휴게시간', '휴일']
      },
      {
        id: 10,
        title: '직장 내 괴롭힘 대처 방법',
        category: '괴롭힘',
        content: `직장 내 괴롭힘으로부터 나를 보호하는 방법

**직장 내 괴롭힘이란?**
사업주 또는 근로자가 직장에서의 지위나 관계 등의 우위를 이용하여 업무상 적정범위를 넘어 다른 근로자에게 신체적·정신적 고통을 주거나 근무환경을 악화시키는 행위

**괴롭힘의 예:**

1. **폭언 및 욕설**
   - 인격 모독적 발언
   - 지속적인 비난

2. **따돌림**
   - 업무에서 배제
   - 의도적 무시

3. **부당한 업무 지시**
   - 능력에 현저히 못 미치는 업무
   - 업무와 무관한 심부름

4. **사생활 침해**
   - 개인 정보 유출
   - 사적 영역 간섭

**대처 방법:**

1. **증거 확보**
   - 문자, 카톡 캡처
   - 녹음 (당사자 간 대화는 합법)
   - 목격자 확보
   - 일지 작성

2. **회사 내부 신고**
   - 인사팀 또는 고충처리 담당자
   - 서면으로 신고

3. **노동청 신고**
   - 관할 지방고용노동청
   - 직장 내 괴롭힘 신고

4. **법적 대응**
   - 민사: 손해배상 청구
   - 형사: 모욕죄, 명예훼손죄 등

**회사의 의무:**
- 신고 접수 시 조사 의무
- 피해자 보호 조치
- 가해자 징계
- 재발 방지 조치

**보호 조치:**
- 근무 장소 변경
- 유급 휴가
- 불리한 처우 금지

**상담 및 신고:**
- 고용노동부 상담센터: 1350
- 직장갑질 119: 1522-9000
- 국번없이 1350

**주의사항:**
- 신고했다는 이유로 불이익 처우 금지
- 비밀 보장 의무
- 허위 신고 시 징계 가능`,
        summary: '직장 내 괴롭힘의 정의와 대처 방법, 법적 보호 조치를 안내합니다.',
        date: '2024-03-06',
        views: 892,
        importance: 'high',
        tags: ['괴롭힘', '직장갑질', '권리보호']
      },
      {
        id: 11,
        title: '미성년자 근로 보호 규정',
        category: '미성년자',
        content: `18세 미만 청소년 근로자를 위한 특별 보호 규정

**연령별 근로 가능 여부:**

1. **15세 미만**
   - 원칙적으로 근로 금지
   - 예외: 고용노동부 장관 인가 (예술공연 등)

2. **15세 이상 18세 미만**
   - 근로 가능
   - 특별 보호 규정 적용

**필수 서류:**

1. **가족관계증명서 또는 주민등록등본**
   - 연령 확인용

2. **친권자 동의서**
   - 부모 또는 후견인 동의 필요

3. **근로계약서**
   - 반드시 서면 작성

**근로시간 제한:**

1. **1일 근로시간**
   - 7시간 이내
   - 당사자 합의 시 1시간 연장 가능 (최대 8시간)

2. **1주 근로시간**
   - 35시간 이내
   - 당사자 합의 시 5시간 연장 가능 (최대 40시간)

3. **야간근로 제한**
   - 오후 10시 ~ 오전 6시 근로 원칙 금지
   - 예외: 본인 동의 + 고용노동부 장관 인가

4. **휴일근로 제한**
   - 원칙적으로 금지
   - 예외: 본인 동의 + 고용노동부 장관 인가

**임금:**
- 최저임금 100% 적용
- 연소자라는 이유로 차별 금지

**연차휴가:**
- 성인과 동일하게 적용

**금지 업무:**
- 도덕상 유해한 업무
- 보건상 유해한 업무
- 안전·보건상 유해·위험한 업무
- 유흥업소 접객업무

**특별 보호:**

1. **임금 직접 지급**
   - 본인에게 직접 지급
   - 부모라도 대리 수령 불가

2. **근로계약 해지**
   - 부당한 계약은 본인 또는 친권자가 해지 가능

3. **증명서 발급**
   - 요청 시 즉시 발급

**위반 시 처벌:**
- 3년 이하 징역 또는 3,000만원 이하 벌금

**상담 및 신고:**
- 청소년근로권익센터: 1644-3119
- 고용노동부: 1350`,
        summary: '18세 미만 청소년 근로자를 위한 특별 보호 규정과 권리를 설명합니다.',
        date: '2024-03-05',
        views: 678,
        importance: 'medium',
        tags: ['미성년자', '청소년', '근로보호']
      },
      {
        id: 12,
        title: '퇴직금 받을 수 있는 조건',
        category: '퇴직금',
        content: `알바생도 퇴직금을 받을 수 있습니다!

**퇴직금 지급 조건:**

1. **계속 근로기간 1년 이상**
   - 입사일부터 퇴사일까지 1년 이상

2. **주 15시간 이상 근무**
   - 4주 평균 주 15시간 이상

**계산 방법:**

**기본 공식:**
1일 평균임금 × 30일 × (재직일수 ÷ 365)

**평균임금:**
퇴직 전 3개월간 받은 임금 총액 ÷ 퇴직 전 3개월간 총 일수

**계산 예시:**

**예시 1:**
- 근무기간: 1년
- 월급: 100만원
- 퇴직금: 100만원

**예시 2:**
- 근무기간: 2년
- 월급: 150만원
- 퇴직금: 300만원

**예시 3:**
- 근무기간: 1년 6개월
- 월급: 120만원
- 퇴직금: 180만원

**주의사항:**

1. **중간정산 금지**
   - 2012년 7월 26일 이후 원칙적으로 금지
   - 예외: 무주택자 주택 구입, 6개월 이상 요양 등

2. **지급 시기**
   - 퇴직일로부터 14일 이내
   - 당사자 합의 시 연장 가능

3. **미지급 시**
   - 노동청 진정
   - 3년 이하 징역 또는 3,000만원 이하 벌금

**퇴직금 계산기:**
고용노동부 홈페이지에서 자동 계산 가능

**확인 방법:**

1. **근로계약서 확인**
   - 퇴직금 지급 조건 명시

2. **급여명세서 확인**
   - 퇴직금 적립 여부

3. **퇴직금 명세서 요청**
   - 퇴사 시 반드시 요청

**대체 제도:**

**퇴직연금 (DC, DB)**
- 회사가 선택
- 퇴직금과 동일한 효과

**주의:**
- 5인 미만 사업장도 퇴직금 지급 의무 있음
- 일용직도 조건 충족 시 퇴직금 받을 수 있음`,
        summary: '알바생의 퇴직금 지급 조건과 계산 방법, 미지급 시 대처 방법을 안내합니다.',
        date: '2024-03-04',
        views: 1567,
        importance: 'medium',
        tags: ['퇴직금', '계산', '권리']
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, []);

  const categories = [
    { id: 'all', name: '전체', icon: 'ri-apps-line' },
    { id: '근로계약', name: '근로계약', icon: 'ri-file-text-line' },
    { id: '임금', name: '임금', icon: 'ri-money-dollar-circle-line' },
    { id: '근로시간', name: '근로시간', icon: 'ri-time-line' },
    { id: '휴가', name: '휴가', icon: 'ri-calendar-line' },
    { id: '해고', name: '해고', icon: 'ri-user-unfollow-line' },
    { id: '산재', name: '산재', icon: 'ri-shield-cross-line' },
    { id: '보험', name: '보험', icon: 'ri-shield-check-line' },
    { id: '괴롭힘', name: '괴롭힘', icon: 'ri-alert-line' },
    { id: '미성년자', name: '미성년자', icon: 'ri-user-smile-line' },
    { id: '퇴직금', name: '퇴직금', icon: 'ri-gift-line' }
  ];

  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'high':
        return '필독';
      case 'medium':
        return '중요';
      default:
        return '일반';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/employee-dashboard" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <i className="ri-arrow-left-line text-gray-600"></i>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">알바생 권리 교육 📚</h1>
              <p className="text-gray-600 mt-1">알바생이 꼭 알아야 할 근로 권리를 배워요</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
            <div className="text-3xl font-bold mb-2 text-blue-500">{posts.length}</div>
            <div className="text-gray-600">📖 총 교육 자료</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100">
            <div className="text-3xl font-bold mb-2 text-green-500">
              {posts.filter(p => p.importance === 'high').length}
            </div>
            <div className="text-gray-600">⭐ 필독 자료</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-purple-100">
            <div className="text-3xl font-bold mb-2 text-purple-500">
              {posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">👀 총 조회수</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목, 내용, 태그로 검색하세요..."
              className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <i className={category.icon}></i>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">교육 자료를 불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getImportanceColor(post.importance)}`}>
                          {getImportanceText(post.importance)}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-800 mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{post.summary}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <i className="ri-calendar-line mr-1"></i>
                          {post.date}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-eye-line mr-1"></i>
                          {post.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400 text-xl ml-4"></i>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            )}

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-search-line text-2xl text-gray-400"></i>
                </div>
                <p className="text-gray-500">검색 결과가 없습니다</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getImportanceColor(selectedPost.importance)}`}>
                    {getImportanceText(selectedPost.importance)}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium">
                    {selectedPost.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPost.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <i className="ri-calendar-line mr-1"></i>
                    {selectedPost.date}
                  </span>
                  <span className="flex items-center">
                    <i className="ri-eye-line mr-1"></i>
                    {selectedPost.views.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer ml-4"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedPost.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <i className="ri-information-line text-blue-500 text-xl mt-0.5"></i>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1">도움이 필요하신가요?</h4>
                    <p className="text-sm text-blue-700">
                      고용노동부 상담센터 <strong>1350</strong>으로 전화하시면 전문 상담을 받으실 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
