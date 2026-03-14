import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentQuestion, getRatingsForType } from '@/data/assessmentQuestions';
import { AssessmentResponse } from '@/types/assessment';
import { ArrowLeft, ArrowRight, MessageCircle, AlertTriangle, Info } from 'lucide-react';
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
  // GMHAT progress context
  activeIndex: number;
  totalActiveQuestions: number;
  skippedCount: number;
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
  activeIndex,
  totalActiveQuestions,
  skippedCount,
}: QuestionCardProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(
    existingResponse?.rating ?? null
  );
  const [notes, setNotes] = useState(existingResponse?.notes || '');
  const [showNotes, setShowNotes] = useState(!!existingResponse?.notes);

  useEffect(() => {
    setSelectedRating(existingResponse?.rating ?? null);
    setNotes(existingResponse?.notes || '');
    setShowNotes(!!existingResponse?.notes);
  }, [question.id, existingResponse]);

  const ratings = getRatingsForType(question.ratingType);

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
    if (!isSelected) return '';
    switch (value) {
      case 0: return 'bg-success text-success-foreground border-transparent';
      case 1: return 'bg-yellow-500 text-white border-transparent';
      case 2: return 'bg-warning text-warning-foreground border-transparent';
      case 3: return 'bg-destructive text-destructive-foreground border-transparent';
      default: return 'bg-primary text-primary-foreground border-transparent';
    }
  };

  // Suicidal ideation question gets a prominent alert header
  const isSuicidalIdeation = question.id === 'suicidal_ideation';

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* GMHAT progress context bar */}
      <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
        <span>Question {activeIndex + 1} of {totalActiveQuestions}</span>
        {skippedCount > 0 && (
          <span className="flex items-center gap-1 text-primary">
            <Info className="w-3.5 h-3.5" />
            {skippedCount} question{skippedCount > 1 ? 's' : ''} skipped (not indicated)
          </span>
        )}
      </div>

      <Card className={cn('shadow-lg', isSuicidalIdeation && 'border-destructive/50')}>
        {/* Critical safety alert for suicidal ideation */}
        {isSuicidalIdeation && (
          <div className="bg-destructive/10 border-b border-destructive/30 px-6 py-3 flex items-start gap-3 rounded-t-lg">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">Critical Safety Question</p>
              <p className="text-xs text-destructive/80 mt-0.5">
                Any positive response requires immediate clinical action and risk assessment.
              </p>
            </div>
          </div>
        )}

        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{categoryIcon}</span>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {categoryName}
            </span>
            {question.isScreening && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                Screening
              </span>
            )}
          </div>

          <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>

          {/* Clinician prompts (sub-questions) */}
          {question.subQuestions && question.subQuestions.length > 0 && (
            <CardDescription className="mt-3">
              <ul className="space-y-1">
                {question.subQuestions.map((sq, idx) => (
                  <li key={idx} className="text-muted-foreground">• {sq}</li>
                ))}
              </ul>
            </CardDescription>
          )}

          {/* Clinician guidance note */}
          {question.clinicianNote && !isSuicidalIdeation && (
            <div className="mt-3 flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-2">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300 italic">
                {question.clinicianNote}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Rating options */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Rate the symptom severity:
            </p>
            <div className="grid gap-3">
              {ratings.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => handleRatingSelect(rating.value)}
                  className={cn(
                    'w-full p-4 rounded-lg text-left transition-all duration-200 border-2',
                    selectedRating === rating.value
                      ? getSeverityColor(rating.value, true)
                      : 'bg-card border-border hover:border-primary/50 hover:bg-accent'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">
                        {rating.value} — {rating.label}
                      </span>
                      <p className={cn(
                        'text-sm mt-1',
                        selectedRating === rating.value ? 'opacity-90' : 'text-muted-foreground'
                      )}>
                        {rating.description}
                      </p>
                    </div>
                    {selectedRating === rating.value && (
                      <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center shrink-0 ml-3">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes section */}
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className="text-muted-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {showNotes ? 'Hide Notes' : 'Add Clinician Notes'}
            </Button>
            {showNotes && (
              <Textarea
                placeholder="Add any additional observations or clinical notes..."
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="mt-3"
                rows={3}
              />
            )}
          </div>

          {/* Navigation */}
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
