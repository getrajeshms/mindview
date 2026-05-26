import { Progress } from '@/components/ui/progress';
import a1interceptLogo from '@/assets/a1intercept-logo.jpeg';

interface ProgressHeaderProps {
  progress: number;
  currentCategory?: string;
  currentStep: string;
}

export function ProgressHeader({ progress, currentCategory, currentStep }: ProgressHeaderProps) {
  const getStepLabel = () => {
    switch (currentStep) {
      case 'patient-info':
        return 'Patient Information';
      case 'background':
        return 'Background Details';
      case 'assessment':
        return currentCategory || 'Assessment';
      case 'clinical':
        return 'Clinical Judgement';
      case 'report':
        return 'Assessment Report';
      default:
        return '';
    }
  };

  return (
    <div className="bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img 
              src={a1interceptLogo} 
              alt="A1Intercept Technologies" 
              className="h-8 rounded"
            />
            <h2 className="text-lg font-semibold text-foreground">{getStepLabel()}</h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
