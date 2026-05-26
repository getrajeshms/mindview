import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientInfo } from '@/types/assessment';
import { User, Calendar, UserCircle, Hash, Stethoscope } from 'lucide-react';

interface PatientInfoFormProps {
  patientInfo: PatientInfo;
  onChange: (info: PatientInfo) => void;
  onNext: () => void;
}

export function PatientInfoForm({ patientInfo, onChange, onNext }: PatientInfoFormProps) {
  const handleChange = (field: keyof PatientInfo, value: string) => {
    onChange({ ...patientInfo, [field]: value });
  };

  const isValid = patientInfo.name && patientInfo.age && patientInfo.gender && patientInfo.interviewerName;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center border-b border-border pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Patient Information</CardTitle>
          <CardDescription>
            Please enter the patient's details to begin the mental health assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Patient Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={patientInfo.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="uniqueId" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Unique ID
              </Label>
              <Input
                id="uniqueId"
                placeholder="Patient ID (optional)"
                value={patientInfo.uniqueId}
                onChange={(e) => handleChange('uniqueId', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Age *
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={patientInfo.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Gender *
              </Label>
              <Select
                value={patientInfo.gender}
                onValueChange={(value) => handleChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="interviewer" className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Interviewer Name *
                </Label>
                <Input
                  id="interviewer"
                  placeholder="Your name"
                  value={patientInfo.interviewerName}
                  onChange={(e) => handleChange('interviewerName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Interview Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={patientInfo.interviewDate}
                  onChange={(e) => handleChange('interviewDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="w-full mt-6"
            size="lg"
          >
            Continue to Background Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
