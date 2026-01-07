import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentQuestion, severityRatings, alcoholRatings, drugRatings, stressRatings } from '@/data/assessmentQuestions';
import { AssessmentResponse } from '@/types/assessment';
import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: AssessmentQuestion;
  categoryName: string;
  categoryIcon: string;
  existingResponse?: AssessmentResponse;
  onSave: (questionId: string, rating: number, notes?: string) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function QuestionCard({
  question,
  categoryName,
  categoryIcon,
  existingResponse,
  onSave,
  onNext,
  onBack,
  isFirst,
  isLast,
}: QuestionCardProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(existingResponse?.rating ?? null);
  const [notes, setNotes] = useState(existingResponse?.notes || '');
  const [showNotes, setShowNotes] = useState(!!existingResponse?.notes);

  useEffect(() => {
    setSelectedRating(existingResponse?.rating ?? null);
    setNotes(existingResponse?.notes || '');
    setShowNotes(!!existingResponse?.notes);
  }, [question.id, existingResponse]);

  const getRatings = () => {
    switch (question.ratingType) {
      case 'alcohol':
        return alcoholRatings;
      case 'drug':
        return drugRatings;
      case 'stress':
        return stressRatings;
      default:
        return severityRatings;
    }
  };

  const ratings = getRatings();

  const handleRatingSelect = (value: number) => {
    setSelectedRating(value);
    onSave(question.id, value, notes);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    if (selectedRating !== null) {
      onSave(question.id, selectedRating, value);
    }
  };

  const handleNext = () => {
    if (selectedRating !== null) {
      onSave(question.id, selectedRating, notes);
    }
    onNext();
  };

  const getSeverityColor = (value: number, isSelected: boolean) => {
    if (!isSelected) return 'bg-muted hover:bg-accent';
    switch (value) {
      case 0:
        return 'bg-success text-success-foreground';
      case 1:
        return 'bg-yellow-500 text-white';
      case 2:
        return 'bg-warning text-warning-foreground';
      case 3:
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{categoryIcon}</span>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {categoryName}
            </span>
          </div>
          <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
          {question.subQuestions && question.subQuestions.length > 0 && (
            <CardDescription className="mt-3">
              <ul className="space-y-1">
                {question.subQuestions.map((sq, idx) => (
                  <li key={idx} className="text-muted-foreground">• {sq}</li>
                ))}
              </ul>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Rate the symptom severity:</p>
            <div className="grid gap-3">
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => handleRatingSelect(rating.value)}
                  className={cn(
                    'w-full p-4 rounded-lg text-left transition-all duration-200 border-2',
                    selectedRating === rating.value
                      ? `${getSeverityColor(rating.value, true)} border-transparent`
                      : 'bg-card border-border hover:border-primary/50 hover:bg-accent'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{rating.value} - {rating.label}</span>
                      <p className={cn(
                        'text-sm mt-1',
                        selectedRating === rating.value ? 'opacity-90' : 'text-muted-foreground'
                      )}>
                        {rating.description}
                      </p>
                    </div>
                    {selectedRating === rating.value && (
                      <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className="text-muted-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {showNotes ? 'Hide Notes' : 'Add Notes'}
            </Button>
            {showNotes && (
              <Textarea
                placeholder="Add any additional observations or notes..."
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="mt-3"
                rows={3}
              />
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isFirst ? 'Back to Background' : 'Previous'}
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedRating === null}
              className="flex-1"
            >
              {isLast ? 'Finish Assessment' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
