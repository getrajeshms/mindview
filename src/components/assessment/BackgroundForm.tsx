import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BackgroundInfo } from '@/types/assessment';
import { FileText, ArrowLeft, ArrowRight } from 'lucide-react';

interface BackgroundFormProps {
  backgroundInfo: BackgroundInfo;
  onChange: (info: BackgroundInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BackgroundForm({ backgroundInfo, onChange, onNext, onBack }: BackgroundFormProps) {
  const handleChange = (field: keyof BackgroundInfo, value: any) => {
    onChange({ ...backgroundInfo, [field]: value });
  };

  const handleTraumaChange = (type: keyof BackgroundInfo['trauma'], checked: boolean) => {
    onChange({
      ...backgroundInfo,
      trauma: { ...backgroundInfo.trauma, [type]: checked },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center border-b border-border pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Background Details</CardTitle>
          <CardDescription>
            Please describe the patient's background and any relevant history
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="presentProblems">Present Mental Health Problems</Label>
            <Textarea
              id="presentProblems"
              placeholder="How have you been recently? Do you have any problems?"
              value={backgroundInfo.presentProblems}
              onChange={(e) => handleChange('presentProblems', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration of Present Problem</Label>
            <Textarea
              id="duration"
              placeholder="When did they begin?"
              value={backgroundInfo.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pastProblems">Past Mental Health Problems</Label>
            <Textarea
              id="pastProblems"
              placeholder="Have you ever had any problems with your mental health in the past?"
              value={backgroundInfo.pastProblems}
              onChange={(e) => handleChange('pastProblems', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyBackground">Family Background</Label>
            <Textarea
              id="familyBackground"
              placeholder="Please tell me about your family. Has anyone suffered with mental health problems?"
              value={backgroundInfo.familyBackground}
              onChange={(e) => handleChange('familyBackground', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalSocialBackground">Personal & Social Background</Label>
            <Textarea
              id="personalSocialBackground"
              placeholder="Any distressing personal/social issues? Physical health, housing, work, finances, relationships?"
              value={backgroundInfo.personalSocialBackground}
              onChange={(e) => handleChange('personalSocialBackground', e.target.value)}
              rows={2}
            />
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <Label>Reported Trauma or Abuse</Label>
            <div className="grid grid-cols-2 gap-4">
              {(['physical', 'emotional', 'sexual', 'neglect'] as const).map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={backgroundInfo.trauma[type]}
                    onCheckedChange={(checked) => handleTraumaChange(type, checked as boolean)}
                  />
                  <Label htmlFor={type} className="capitalize cursor-pointer">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="epilepsy"
                checked={backgroundInfo.epilepsy}
                onCheckedChange={(checked) => handleChange('epilepsy', checked)}
              />
              <Label htmlFor="epilepsy" className="cursor-pointer">
                History of fits or epilepsy
              </Label>
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <Label>Intellectual Disability</Label>
            <RadioGroup
              value={backgroundInfo.intellectualDisability}
              onValueChange={(value) => handleChange('intellectualDisability', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="cursor-pointer">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mild" id="mild" />
                <Label htmlFor="mild" className="cursor-pointer">Mild/Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="severe" id="severe" />
                <Label htmlFor="severe" className="cursor-pointer">Severe</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={onNext} className="flex-1">
              Start Assessment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
