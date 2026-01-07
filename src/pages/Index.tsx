import { useState } from 'react';
import { useAssessment } from '@/hooks/useAssessment';
import { WelcomeScreen } from '@/components/assessment/WelcomeScreen';
import { ProgressHeader } from '@/components/assessment/ProgressHeader';
import { PatientInfoForm } from '@/components/assessment/PatientInfoForm';
import { BackgroundForm } from '@/components/assessment/BackgroundForm';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { ClinicalJudgementForm } from '@/components/assessment/ClinicalJudgementForm';
import { AssessmentReport } from '@/components/assessment/AssessmentReport';
import { assessmentCategories } from '@/data/assessmentQuestions';
import { AssessmentResult } from '@/types/assessment';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [generatedResult, setGeneratedResult] = useState<AssessmentResult | null>(null);

  const {
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
  } = useAssessment();

  const handleStartAssessment = () => {
    setShowWelcome(false);
  };

  const handleNewAssessment = () => {
    resetAssessment();
    setGeneratedResult(null);
    setShowWelcome(true);
  };

  const handleGenerateReport = () => {
    const result = generateResult();
    setGeneratedResult(result);
    setCurrentStep('report');
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'patient-info':
        return 5;
      case 'background':
        return 10;
      case 'assessment':
        return 10 + (getProgress() * 0.75);
      case 'clinical':
        return 90;
      case 'report':
        return 100;
      default:
        return 0;
    }
  };

  const isFirstQuestion = currentCategoryIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion =
    currentCategoryIndex === assessmentCategories.length - 1 &&
    currentQuestionIndex === currentCategory?.questions.length - 1;

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStartAssessment} />;
  }

  if (currentStep === 'report' && generatedResult) {
    return (
      <AssessmentReport
        result={generatedResult}
        onNewAssessment={handleNewAssessment}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProgressHeader
        progress={getStepProgress()}
        currentCategory={currentCategory?.name}
        currentStep={currentStep}
      />

      {currentStep === 'patient-info' && (
        <PatientInfoForm
          patientInfo={patientInfo}
          onChange={setPatientInfo}
          onNext={() => setCurrentStep('background')}
        />
      )}

      {currentStep === 'background' && (
        <BackgroundForm
          backgroundInfo={backgroundInfo}
          onChange={setBackgroundInfo}
          onNext={() => setCurrentStep('assessment')}
          onBack={() => setCurrentStep('patient-info')}
        />
      )}

      {currentStep === 'assessment' && currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          categoryName={currentCategory.name}
          categoryIcon={currentCategory.icon}
          existingResponse={getResponse(currentQuestion.id)}
          onSave={saveResponse}
          onNext={nextQuestion}
          onBack={prevQuestion}
          isFirst={isFirstQuestion}
          isLast={isLastQuestion}
        />
      )}

      {currentStep === 'clinical' && (
        <ClinicalJudgementForm
          clinicalJudgement={clinicalJudgement}
          treatmentGiven={treatmentGiven}
          assistanceRequired={assistanceRequired}
          onClinicalChange={setClinicalJudgement}
          onTreatmentChange={setTreatmentGiven}
          onAssistanceChange={setAssistanceRequired}
          onBack={() => {
            setCurrentStep('assessment');
          }}
          onGenerateReport={handleGenerateReport}
        />
      )}
    </div>
  );
};

export default Index;
