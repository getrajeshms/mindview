import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ClipboardList, FileText, Shield } from 'lucide-react';
import a1interceptLogo from '@/assets/a1intercept-logo.jpeg';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const features = [
    {
      icon: ClipboardList,
      title: 'Structured Assessment',
      description: 'Comprehensive evaluation across multiple mental health domains',
    },
    {
      icon: Brain,
      title: 'Evidence-Based',
      description: 'Based on validated clinical assessment methodologies',
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Generate professional reports with symptom ratings and recommendations',
    },
    {
      icon: Shield,
      title: 'Confidential',
      description: 'All assessments are private and secure',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <img 
            src={a1interceptLogo} 
            alt="A1Intercept Technologies" 
            className="h-20 mx-auto mb-6 rounded-lg"
          />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Mental Health Assessment Tool
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive semi-structured interview tool to assist healthcare professionals in making mental health assessments in primary care settings.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Assessment Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Please read manual before administering the assessment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Take account of all information, including reports from carers
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Rate symptoms the person has experienced in the last month
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                You may ask supplementary questions to establish severity
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button size="lg" onClick={onStart} className="px-12 py-6 text-lg">
            Start New Assessment
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          This tool is presented as an aid to healthcare professionals. It is not a substitute for a detailed clinical assessment.
        </p>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          Powered by <span className="font-semibold">A1Intercept Technologies</span>
        </p>
      </div>
    </div>
  );
}
