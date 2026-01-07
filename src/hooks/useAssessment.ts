import { useState, useCallback } from 'react';
import { PatientInfo, BackgroundInfo, AssessmentResponse, AssessmentResult } from '@/types/assessment';
import { assessmentCategories, getAllQuestions } from '@/data/assessmentQuestions';

export type AssessmentStep = 'patient-info' | 'background' | 'assessment' | 'clinical' | 'report';

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
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(initialPatientInfo);
  const [backgroundInfo, setBackgroundInfo] = useState<BackgroundInfo>(initialBackgroundInfo);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [clinicalJudgement, setClinicalJudgement] = useState('');
  const [treatmentGiven, setTreatmentGiven] = useState('');
  const [assistanceRequired, setAssistanceRequired] = useState('');

  const totalQuestions = getAllQuestions().length;
  const currentCategory = assessmentCategories[currentCategoryIndex];
  const currentQuestion = currentCategory?.questions[currentQuestionIndex];

  const getProgress = useCallback(() => {
    let completedQuestions = 0;
    for (let i = 0; i < currentCategoryIndex; i++) {
      completedQuestions += assessmentCategories[i].questions.length;
    }
    completedQuestions += currentQuestionIndex;
    return (completedQuestions / totalQuestions) * 100;
  }, [currentCategoryIndex, currentQuestionIndex, totalQuestions]);

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
    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentCategoryIndex < assessmentCategories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      setCurrentStep('clinical');
    }
  }, [currentQuestionIndex, currentCategoryIndex, currentCategory]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentCategoryIndex > 0) {
      const prevCategoryIndex = currentCategoryIndex - 1;
      setCurrentCategoryIndex(prevCategoryIndex);
      setCurrentQuestionIndex(assessmentCategories[prevCategoryIndex].questions.length - 1);
    } else {
      setCurrentStep('background');
    }
  }, [currentQuestionIndex, currentCategoryIndex]);

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
    setCurrentCategoryIndex(0);
    setCurrentQuestionIndex(0);
    setPatientInfo(initialPatientInfo);
    setBackgroundInfo(initialBackgroundInfo);
    setResponses([]);
    setClinicalJudgement('');
    setTreatmentGiven('');
    setAssistanceRequired('');
  }, []);

  return {
    currentStep,
    setCurrentStep,
    currentCategoryIndex,
    currentQuestionIndex,
    currentCategory,
    currentQuestion,
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
    totalQuestions,
  };
}
