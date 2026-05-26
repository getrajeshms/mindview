import { useState, useCallback } from 'react';
import { PatientInfo, BackgroundInfo, AssessmentResponse, AssessmentResult } from '@/types/assessment';
import { assessmentCategories, AssessmentCategory, AssessmentQuestion } from '@/data/assessmentQuestions';

export type AssessmentStep = 'patient-info' | 'background' | 'assessment' | 'clinical' | 'report';

// ─────────────────────────────────────────────────────────────────────────────
// BRANCHING LOGIC ENGINE
// For each domain, check if ALL screening questions scored 0.
// If so, mark remaining (non-screening) questions as skipped.
// ─────────────────────────────────────────────────────────────────────────────
export function shouldSkipQuestion(
  question: AssessmentQuestion,
  category: AssessmentCategory,
  responses: AssessmentResponse[]
): boolean {
  // Screening questions are never skipped — they are always shown
  if (question.isScreening) return false;

  // Check if ALL screening questions in this domain scored 0
  const allScreeningZero = category.screeningQuestionIds.every(screenId => {
    const response = responses.find(r => r.questionId === screenId);
    // If not yet answered, don't skip (conservative — show the question)
    if (response === undefined) return false;
    return response.rating === 0;
  });

  return allScreeningZero;
}

// Build a flat ordered list of questions, filtering out skipped ones
export function buildActiveQuestionList(responses: AssessmentResponse[]): Array<{
  category: AssessmentCategory;
  question: AssessmentQuestion;
  skipped: boolean;
}> {
  const list: Array<{ category: AssessmentCategory; question: AssessmentQuestion; skipped: boolean }> = [];
  for (const category of assessmentCategories) {
    for (const question of category.questions) {
      const skipped = shouldSkipQuestion(question, category, responses);
      list.push({ category, question, skipped });
    }
  }
  return list;
}

// Get only the questions that should be shown (not skipped)
export function getActiveQuestions(responses: AssessmentResponse[]) {
  return buildActiveQuestionList(responses).filter(item => !item.skipped);
}

const initialPatientInfo: PatientInfo = {
  name: '',
  age: '',
  gender: '',
  uniqueId: '',
  interviewerName: '',
  interviewDate: new Date().toISOString().split('T')[0],
};

const initialBackgroundInfo: BackgroundInfo = {
  presentProblems: '',
  duration: '',
  pastProblems: '',
  familyBackground: '',
  personalSocialBackground: '',
  trauma: {
    physical: false,
    emotional: false,
    sexual: false,
    neglect: false,
  },
  epilepsy: false,
  intellectualDisability: 'no',
};

export function useAssessment() {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('patient-info');
  // activeIndex is the index into getActiveQuestions(responses)
  const [activeIndex, setActiveIndex] = useState(0);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(initialPatientInfo);
  const [backgroundInfo, setBackgroundInfo] = useState<BackgroundInfo>(initialBackgroundInfo);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [clinicalJudgement, setClinicalJudgement] = useState('');
  const [treatmentGiven, setTreatmentGiven] = useState('');
  const [assistanceRequired, setAssistanceRequired] = useState('');

  // Recompute active questions every time responses change (branching is dynamic)
  const activeQuestions = getActiveQuestions(responses);
  const currentItem = activeQuestions[activeIndex];
  const currentCategory = currentItem?.category;
  const currentQuestion = currentItem?.question;

  // For ProgressHeader compatibility — derive category/question indices
  const currentCategoryIndex = currentCategory
    ? assessmentCategories.findIndex(c => c.id === currentCategory.id)
    : 0;
  const currentQuestionIndex = currentQuestion && currentCategory
    ? currentCategory.questions.findIndex(q => q.id === currentQuestion.id)
    : 0;

  const totalActiveQuestions = activeQuestions.length;

  const getProgress = useCallback(() => {
    if (totalActiveQuestions === 0) return 0;
    return (activeIndex / totalActiveQuestions) * 100;
  }, [activeIndex, totalActiveQuestions]);

  const saveResponse = useCallback((questionId: string, rating: number, notes?: string) => {
    setResponses(prev => {
      const existing = prev.findIndex(r => r.questionId === questionId);
      const newResponse = { questionId, rating, notes };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newResponse;
        return updated;
      }
      return [...prev, newResponse];
    });
  }, []);

  const getResponse = useCallback((questionId: string) => {
    return responses.find(r => r.questionId === questionId);
  }, [responses]);

  const nextQuestion = useCallback(() => {
    // Recompute active list with latest responses to apply branching
    // (responses state update is async, so we pass current responses)
    if (activeIndex < totalActiveQuestions - 1) {
      setActiveIndex(prev => prev + 1);
    } else {
      setCurrentStep('clinical');
    }
  }, [activeIndex, totalActiveQuestions]);

  const prevQuestion = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    } else {
      setCurrentStep('background');
    }
  }, [activeIndex]);

  const generateResult = useCallback((): AssessmentResult => {
    return {
      patientInfo,
      backgroundInfo,
      responses,
      clinicalJudgement,
      treatmentGiven,
      assistanceRequired,
      completedAt: new Date().toISOString(),
    };
  }, [patientInfo, backgroundInfo, responses, clinicalJudgement, treatmentGiven, assistanceRequired]);

  const resetAssessment = useCallback(() => {
    setCurrentStep('patient-info');
    setActiveIndex(0);
    setPatientInfo(initialPatientInfo);
    setBackgroundInfo(initialBackgroundInfo);
    setResponses([]);
    setClinicalJudgement('');
    setTreatmentGiven('');
    setAssistanceRequired('');
  }, []);

  const isFirstQuestion = activeIndex === 0;
  const isLastQuestion = activeIndex === totalActiveQuestions - 1;

  // How many domains are being skipped (for UI display)
  const skippedCount = buildActiveQuestionList(responses).filter(i => i.skipped).length;

  return {
    currentStep,
    setCurrentStep,
    currentCategoryIndex,
    currentQuestionIndex,
    currentCategory,
    currentQuestion,
    activeIndex,
    totalActiveQuestions,
    patientInfo,
    setPatientInfo,
    backgroundInfo,
    setBackgroundInfo,
    responses,
    saveResponse,
    getResponse,
    nextQuestion,
    prevQuestion,
    getProgress,
    clinicalJudgement,
    setClinicalJudgement,
    treatmentGiven,
    setTreatmentGiven,
    assistanceRequired,
    setAssistanceRequired,
    generateResult,
    resetAssessment,
    isFirstQuestion,
    isLastQuestion,
    skippedCount,
    // Keep for backward compat with ProgressHeader
    totalQuestions: totalActiveQuestions,
  };
}
