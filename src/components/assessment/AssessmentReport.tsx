import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssessmentResult, SymptomSummary } from '@/types/assessment';
import { assessmentCategories } from '@/data/assessmentQuestions';
import { Download, RotateCcw, Printer, AlertTriangle, CheckCircle, AlertCircle, XCircle, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';

interface AssessmentReportProps {
  result: AssessmentResult;
  onNewAssessment: () => void;
}

export function AssessmentReport({ result, onNewAssessment }: AssessmentReportProps) {
  const calculateSymptomSummaries = (): SymptomSummary[] => {
    const summaries: SymptomSummary[] = [];

    const categoryScores: Record<string, { total: number; max: number; count: number }> = {};

    assessmentCategories.forEach((category) => {
      categoryScores[category.id] = { total: 0, max: 0, count: 0 };
      category.questions.forEach((q) => {
        const response = result.responses.find((r) => r.questionId === q.id);
        if (response) {
          categoryScores[category.id].total += response.rating;
          categoryScores[category.id].max += 3;
          categoryScores[category.id].count++;
        }
      });
    });

    Object.entries(categoryScores).forEach(([categoryId, scores]) => {
      const category = assessmentCategories.find((c) => c.id === categoryId);
      if (!category || scores.count === 0) return;

      const avgScore = scores.total / scores.count;
      let severity: SymptomSummary['severity'];

      if (avgScore === 0) severity = 'No';
      else if (avgScore <= 1) severity = 'Mild';
      else if (avgScore <= 2) severity = 'Moderate';
      else severity = 'Severe';

      summaries.push({
        category: category.name,
        severity,
        score: scores.total,
        maxScore: scores.max,
      });
    });

    return summaries;
  };

  const symptomSummaries = calculateSymptomSummaries();

  const getMainDiagnosis = () => {
    const severeSymptoms = symptomSummaries.filter((s) => s.severity === 'Severe');
    if (severeSymptoms.length > 0) {
      return severeSymptoms[0].category;
    }
    const moderateSymptoms = symptomSummaries.filter((s) => s.severity === 'Moderate');
    if (moderateSymptoms.length > 0) {
      return moderateSymptoms[0].category;
    }
    return 'No significant symptoms detected';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'No':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'Mild':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'Moderate':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'Severe':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <CheckCircle className="w-5 h-5 text-success" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'No':
        return 'bg-success/10 text-success';
      case 'Mild':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'Moderate':
        return 'bg-warning/10 text-warning';
      case 'Severe':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTraumaList = () => {
    const traumas = [];
    if (result.backgroundInfo.trauma.physical) traumas.push('Physical');
    if (result.backgroundInfo.trauma.emotional) traumas.push('Emotional');
    if (result.backgroundInfo.trauma.sexual) traumas.push('Sexual');
    if (result.backgroundInfo.trauma.neglect) traumas.push('Neglect');
    return traumas.length > 0 ? traumas.join(', ') : 'None reported';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Patient Info Sheet
    const patientData = [
      ['Patient Information'],
      ['Name', result.patientInfo.name],
      ['Age', result.patientInfo.age],
      ['Gender', result.patientInfo.gender],
      ['Unique ID', result.patientInfo.uniqueId || 'N/A'],
      ['Interviewer', result.patientInfo.interviewerName],
      ['Date', formatDate(result.completedAt)],
      [],
      ['Background Information'],
      ['Present Problems', result.backgroundInfo.presentProblems || 'Not specified'],
      ['Duration', result.backgroundInfo.duration || 'Not specified'],
      ['Past Problems', result.backgroundInfo.pastProblems || 'None'],
      ['Family Background', result.backgroundInfo.familyBackground || 'Not specified'],
      ['Reported Trauma', getTraumaList()],
    ];
    const patientSheet = XLSX.utils.aoa_to_sheet(patientData);
    XLSX.utils.book_append_sheet(workbook, patientSheet, 'Patient Info');

    // Symptoms Sheet
    const symptomsData = [
      ['Category', 'Score', 'Max Score', 'Severity'],
      ...symptomSummaries.map((s) => [s.category, s.score, s.maxScore, s.severity]),
    ];
    const symptomsSheet = XLSX.utils.aoa_to_sheet(symptomsData);
    XLSX.utils.book_append_sheet(workbook, symptomsSheet, 'Symptoms');

    // Detailed Responses Sheet
    const responsesData = [
      ['Category', 'Question', 'Rating', 'Notes'],
      ...result.responses.map((r) => {
        const category = assessmentCategories.find((c) =>
          c.questions.some((q) => q.id === r.questionId)
        );
        const question = category?.questions.find((q) => q.id === r.questionId);
        return [
          category?.name || 'Unknown',
          question?.question || r.questionId,
          r.rating,
          r.notes || '',
        ];
      }),
    ];
    const responsesSheet = XLSX.utils.aoa_to_sheet(responsesData);
    XLSX.utils.book_append_sheet(workbook, responsesSheet, 'Detailed Responses');

    // Clinical Sheet
    const clinicalData = [
      ['Clinical Summary'],
      ['Suggested Main Problem', getMainDiagnosis()],
      ['Clinical Judgement', result.clinicalJudgement || 'Not provided'],
      ['Treatment Given', result.treatmentGiven || 'Not specified'],
      ['Assistance Required', result.assistanceRequired || 'Not specified'],
    ];
    const clinicalSheet = XLSX.utils.aoa_to_sheet(clinicalData);
    XLSX.utils.book_append_sheet(workbook, clinicalSheet, 'Clinical Summary');

    // Download
    const fileName = `GMHAT_Report_${result.patientInfo.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 print:p-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-foreground">Assessment Report</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={handleDownloadExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={onNewAssessment}>
            <RotateCcw className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      <Card className="shadow-lg print:shadow-none">
        <CardHeader className="bg-primary text-primary-foreground print:bg-transparent print:text-foreground border-b">
          <div className="text-center">
            <CardTitle className="text-2xl mb-2">Mental Health Assessment Report</CardTitle>
            <p className="text-primary-foreground/80 print:text-muted-foreground">
              Interviewed by {result.patientInfo.interviewerName} on {formatDate(result.completedAt)}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Patient Info */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-primary border-b pb-2">Patient Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{result.patientInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{result.patientInfo.age}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{result.patientInfo.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unique ID</p>
                <p className="font-medium">{result.patientInfo.uniqueId || 'N/A'}</p>
              </div>
            </div>
          </section>

          {/* Background */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-primary border-b pb-2">Background Information</h3>
            <div className="grid gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Present Problems</p>
                <p className="font-medium">{result.backgroundInfo.presentProblems || 'Not specified'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{result.backgroundInfo.duration || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Past Problems</p>
                  <p className="font-medium">{result.backgroundInfo.pastProblems || 'None'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Family Background</p>
                  <p className="font-medium">{result.backgroundInfo.familyBackground || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reported Trauma</p>
                  <p className="font-medium">{getTraumaList()}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Symptom Summary */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-primary border-b pb-2">Symptoms Based on Assessment</h3>
            <div className="grid gap-2">
              {symptomSummaries.map((summary) => (
                <div
                  key={summary.category}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(summary.severity)}
                    <span className="font-medium">{summary.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      Score: {summary.score}/{summary.maxScore}
                    </span>
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        getSeverityClass(summary.severity)
                      )}
                    >
                      {summary.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main Diagnosis */}
          <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold mb-2 text-primary">Suggested Main Problem</h3>
            <p className="text-xl font-bold text-foreground">{getMainDiagnosis()}</p>
          </section>

          {/* Clinical Judgement */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-primary border-b pb-2">Clinical Judgement</h3>
            <p className="font-medium">{result.clinicalJudgement || 'Not provided'}</p>
          </section>

          {/* Treatment & Assistance */}
          <section className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary">Treatment Given</h3>
              <p className="text-muted-foreground">{result.treatmentGiven || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-primary">Assistance Required</h3>
              <p className="text-muted-foreground">{result.assistanceRequired || 'Not specified'}</p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="text-center text-sm text-muted-foreground border-t pt-6 print:mt-8">
            <p className="italic">
              This assessment is presented as an aid to healthcare professionals for a quick mental health assessment.
              It is not a substitute for a detailed clinical assessment or making a diagnosis.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
