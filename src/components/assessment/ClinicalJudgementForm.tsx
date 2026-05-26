import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, ArrowLeft, FileText } from 'lucide-react';

interface ClinicalJudgementFormProps {
  clinicalJudgement: string;
  treatmentGiven: string;
  assistanceRequired: string;
  onClinicalChange: (value: string) => void;
  onTreatmentChange: (value: string) => void;
  onAssistanceChange: (value: string) => void;
  onBack: () => void;
  onGenerateReport: () => void;
}

export function ClinicalJudgementForm({
  clinicalJudgement,
  treatmentGiven,
  assistanceRequired,
  onClinicalChange,
  onTreatmentChange,
  onAssistanceChange,
  onBack,
  onGenerateReport,
}: ClinicalJudgementFormProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center border-b border-border pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Clinical Judgement</CardTitle>
          <CardDescription>
            Please provide your clinical assessment and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clinical">Clinical Judgement</Label>
            <Textarea
              id="clinical"
              placeholder="Enter your clinical observations and diagnosis..."
              value={clinicalJudgement}
              onChange={(e) => onClinicalChange(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment and Help Given So Far</Label>
            <Textarea
              id="treatment"
              placeholder="Describe any treatment or help already provided..."
              value={treatmentGiven}
              onChange={(e) => onTreatmentChange(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assistance">Assistance Required</Label>
            <Textarea
              id="assistance"
              placeholder="What kind of assistance or referral is needed?"
              value={assistanceRequired}
              onChange={(e) => onAssistanceChange(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessment
            </Button>
            <Button onClick={onGenerateReport} className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
