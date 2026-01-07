export interface PatientInfo {
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  uniqueId: string;
  interviewerName: string;
  interviewDate: string;
}

export interface BackgroundInfo {
  presentProblems: string;
  duration: string;
  pastProblems: string;
  familyBackground: string;
  personalSocialBackground: string;
  trauma: {
    physical: boolean;
    emotional: boolean;
    sexual: boolean;
    neglect: boolean;
  };
  epilepsy: boolean;
  intellectualDisability: 'no' | 'mild' | 'severe';
}

export interface AssessmentResponse {
  questionId: string;
  rating: number;
  notes?: string;
}

export interface AssessmentResult {
  patientInfo: PatientInfo;
  backgroundInfo: BackgroundInfo;
  responses: AssessmentResponse[];
  clinicalJudgement: string;
  treatmentGiven: string;
  assistanceRequired: string;
  completedAt: string;
}

export interface SymptomSummary {
  category: string;
  severity: 'No' | 'Mild' | 'Moderate' | 'Severe' | 'Yes';
  score: number;
  maxScore: number;
}
