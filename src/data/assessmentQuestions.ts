// GMHAT/PC faithful assessment data with branching/skip logic
// Each domain has screening questions. If ALL screening questions score 0,
// the remaining questions in that domain are skipped (not shown).
// This mirrors the real GMHAT/PC tree-branch structure.

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  subQuestions?: string[];
  ratingType: 'severity' | 'alcohol' | 'drug' | 'personality' | 'stress' | 'yesno';
  isScreening?: boolean; // if true AND scores 0, remaining domain questions are skipped
  clinicianNote?: string; // shown as italic guidance to interviewer
}

export interface AssessmentCategory {
  id: string;
  name: string;
  icon: string;
  questions: AssessmentQuestion[];
  // IDs of questions that act as gates — if ALL score 0, skip non-screening questions
  screeningQuestionIds: string[];
}

export const severityRatings = [
  { value: 0, label: 'None', description: 'No evidence of presence of symptom' },
  { value: 1, label: 'Mild', description: 'Symptom present and mildly distressing or disabling' },
  { value: 2, label: 'Moderate', description: 'Symptom present and moderately distressing or disabling' },
  { value: 3, label: 'Severe', description: 'Symptom present and severely distressing or disabling' },
];

export const alcoholRatings = [
  { value: 0, label: 'None', description: "Doesn't drink or drinks only socially occasionally" },
  { value: 1, label: 'Social', description: 'Regular social drinking' },
  { value: 2, label: 'Harmful', description: 'Clear evidence of drinking with harmful effects' },
  { value: 3, label: 'Dependent', description: 'Significant drink problem with dependence' },
];

export const drugRatings = [
  { value: 0, label: 'None', description: 'No evidence of any drug misuse' },
  { value: 1, label: 'Occasional', description: 'Occasional use of illicit drugs' },
  { value: 2, label: 'Frequent', description: 'Frequent use of illicit drugs' },
  { value: 3, label: 'Dependent', description: 'Significant use with dependence and complications' },
];

export const stressRatings = [
  { value: 0, label: 'None', description: 'No stress' },
  { value: 1, label: 'Mild', description: 'Mild degree of stress' },
  { value: 2, label: 'Moderate', description: 'Moderate degree of stress' },
  { value: 3, label: 'Severe', description: 'Severe degree of stress' },
];

export const assessmentCategories: AssessmentCategory[] = [
  // ─────────────────────────────────────────────
  // 1. WORRIES
  // Single screening question — no follow-ups needed
  // ─────────────────────────────────────────────
  {
    id: 'worries',
    name: 'Worries',
    icon: '😟',
    screeningQuestionIds: ['worries_main'],
    questions: [
      {
        id: 'worries_main',
        category: 'Worries',
        question: 'Do you tend to worry a lot?',
        subQuestions: [
          'What kind of things do you worry about?',
          'What about money or family problems, your own health or someone else\'s health?',
        ],
        ratingType: 'severity',
        isScreening: true,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. ANXIETY
  // Screening: frightened/nervous. If >0 → ask about panic symptoms
  // ─────────────────────────────────────────────
  {
    id: 'anxiety',
    name: 'Anxiety',
    icon: '😰',
    screeningQuestionIds: ['anxiety_screen'],
    questions: [
      {
        id: 'anxiety_screen',
        category: 'Anxiety',
        question: 'Do you get frightened or nervous for no apparent reason?',
        ratingType: 'severity',
        isScreening: true,
      },
      {
        id: 'anxiety_panic',
        category: 'Anxiety — Panic',
        question: 'Do you get sudden episodes of intense fear or panic attacks?',
        subQuestions: [
          'Do you get palpitations?',
          'Sweating?',
          'Trembling or shaking?',
          'Restless feelings in the stomach?',
        ],
        ratingType: 'severity',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. CONCENTRATION
  // ─────────────────────────────────────────────
  {
    id: 'concentration',
    name: 'Concentration',
    icon: '🧠',
    screeningQuestionIds: ['concentration_main'],
    questions: [
      {
        id: 'concentration_main',
        category: 'Concentration',
        question: 'How is your concentration?',
        subQuestions: [
          'Can you concentrate on talking to someone, or listening to the radio, watching TV, or reading?',
        ],
        ratingType: 'severity',
        isScreening: true,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. DEPRESSION
  // Screening: depressed mood + loss of interest
  // If either >0 → ask sleep, appetite, AND suicidal ideation
  // ─────────────────────────────────────────────
  {
    id: 'depression',
    name: 'Depression',
    icon: '😔',
    screeningQuestionIds: ['depressed_mood', 'loss_of_interest'],
    questions: [
      {
        id: 'depressed_mood',
        category: 'Depressed Mood',
        question: 'Have you been sad or depressed recently?',
        subQuestions: [
          'Have you cried at all or felt like crying?',
          'Is the depression there most of the time or just a few hours?',
        ],
        ratingType: 'severity',
        isScreening: true,
      },
      {
        id: 'loss_of_interest',
        category: 'Loss of Interest',
        question: 'Have you lost interest in things you used to enjoy?',
        subQuestions: ['What have you enjoyed doing recently?'],
        ratingType: 'severity',
        isScreening: true,
      },
      {
        id: 'sleep',
        category: 'Sleep',
        question: 'Have you had trouble sleeping recently?',
        subQuestions: [
          'Do you have difficulties falling asleep?',
          'Do you wake up early in the morning and cannot get back to sleep?',
          'Have you been sleeping more than usual?',
        ],
        ratingType: 'severity',
      },
      {
        id: 'appetite',
        category: 'Appetite',
        question: 'What has your appetite been like?',
        subQuestions: [
          'Do you enjoy your food?',
          'Have you been eating more or less than usual?',
        ],
        ratingType: 'severity',
      },
      {
        id: 'suicidal_ideation',
        category: 'Suicidal Ideation',
        question: 'Have you had thoughts of harming yourself or ending your life?',
        subQuestions: [
          'Have you felt that life is not worth living?',
          'Have you made any plans or attempts?',
        ],
        ratingType: 'severity',
        clinicianNote: 'IMPORTANT: This is a critical safety question. Rate carefully. Any score ≥1 requires immediate clinical action.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5. EATING DISORDERS
  // ─────────────────────────────────────────────
  {
    id: 'eating',
    name: 'Eating Disorders',
    icon: '🍽️',
    screeningQuestionIds: ['eating_concern'],
    questions: [
      {
        id: 'eating_concern',
        category: 'Eating Concern',
        question: 'Are you unduly concerned about eating fattening food?',
        subQuestions: [
          'Differentiate between normal/general concern and excessive, distressing concern.',
        ],
        ratingType: 'severity',
        isScreening: true,
        clinicianNote: 'Rate only excessive concern, not healthy interest in diet.',
      },
      {
        id: 'body_image',
        category: 'Body Image',
        question: 'Do you believe yourself to be fat when others say you are too thin?',
        ratingType: 'severity',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6. HEALTH ANXIETY (Hypochondriasis)
  // ─────────────────────────────────────────────
  {
    id: 'health_anxiety',
    name: 'Health Anxiety',
    icon: '🏥',
    screeningQuestionIds: ['hypochondriasis'],
    questions: [
      {
        id: 'hypochondriasis',
        category: 'Health Anxiety',
        question: 'Do you worry a lot about your health or having a serious illness?',
        subQuestions: [
          'Is there anything about your body which bothers or upsets you?',
          'Are you in pain?',
          'Is any part of your body not working properly?',
        ],
        ratingType: 'severity',
        isScreening: true,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7. OBSESSIONS & COMPULSIONS
  // ─────────────────────────────────────────────
  {
    id: 'ocd',
    name: 'Obsessive Compulsive',
    icon: '🔄',
    screeningQuestionIds: ['obsessions'],
    questions: [
      {
        id: 'obsessions',
        category: 'Obsessions / Compulsions',
        question: 'Do you have to check things over and over again, or repeat actions?',
        subQuestions: [
          'For example, whether you have turned off taps, gas, lights, or locked your door?',
          'Do you wash your hands repeatedly?',
          'Do unwanted, distressing thoughts come into your head and won\'t go away?',
        ],
        ratingType: 'severity',
        isScreening: true,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8. PHOBIAS
  // ─────────────────────────────────────────────
  {
    id: 'phobia',
    name: 'Phobias',
    icon: '😱',
    screeningQuestionIds: ['phobia_screen'],
    questions: [
      {
        id: 'phobia_screen',
        category: 'Phobias',
        question: 'Do you have fears that you know are unreasonable but cannot control?',
        subQuestions: [
          'Like being afraid of crowds, going out alone, or using public transport?',
          'Do you have any other specific fears — animals, heights, blood?',
        ],
        ratingType: 'severity',
        isScreening: true,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 9. MANIA / HYPOMANIA
  // Screening: energy. If >0 → ask about mood elevation
  // ─────────────────────────────────────────────
  {
    id: 'mania',
    name: 'Manic Behaviour',
    icon: '⚡',
    screeningQuestionIds: ['mania_energy'],
    questions: [
      {
        id: 'mania_energy',
        category: 'Mania — Energy',
        question: 'Has there been a period recently when you felt unusually energetic or needed less sleep?',
        ratingType: 'severity',
        isScreening: true,
      },
      {
        id: 'mania_mood',
        category: 'Mania — Elevated Mood',
        question: 'Have you been feeling very happy or elated recently for no apparent reason?',
        subQuestions: [
          'Observe for: disinhibited social behaviour, grandiose beliefs, excessive talking, racing thoughts.',
        ],
        ratingType: 'severity',
        clinicianNote: 'Observe carefully for disinhibition, pressure of speech, and grandiosity during the interview.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10. PSYCHOSIS
  // Screening: thought disorder. If >0 → ask delusions and hallucinations
  // ─────────────────────────────────────────────
  {
    id: 'psychosis',
    name: 'Psychosis',
    icon: '🌀',
    screeningQuestionIds: ['thought_disorder'],
    questions: [
      {
        id: 'thought_disorder',
        category: 'Thought Disorder',
        question: 'Can you think clearly? Do your thoughts get muddled or mixed up?',
        subQuestions: [
          'Observe for disorganised, tangential, or illogical thinking during the interview.',
        ],
        ratingType: 'severity',
        isScreening: true,
        clinicianNote: 'Observe the patient\'s speech and thought process throughout the interview.',
      },
      {
        id: 'delusions',
        category: 'Delusions',
        question: 'Do you believe that people are talking about you, laughing at you, or that TV/radio refers specifically to you?',
        subQuestions: [
          'Do you have any unusual ideas or beliefs that others find hard to understand?',
          'For example, do you feel people are going to harm you?',
        ],
        ratingType: 'severity',
      },
      {
        id: 'auditory_hallucinations',
        category: 'Auditory Hallucinations',
        question: 'Do you hear things that other people cannot hear — like voices when no one is about?',
        subQuestions: [
          'What do the voices say?',
          'How often does this happen?',
        ],
        ratingType: 'severity',
      },
      {
        id: 'visual_hallucinations',
        category: 'Visual Hallucinations',
        question: 'Do you see things or visions that are invisible to other people?',
        subQuestions: ['How often does this happen?'],
        ratingType: 'severity',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 11. DISORIENTATION
  // ─────────────────────────────────────────────
  {
    id: 'disorientation',
    name: 'Disorientation',
    icon: '🧭',
    screeningQuestionIds: ['time_orientation'],
    questions: [
      {
        id: 'time_orientation',
        category: 'Time Orientation',
        question: 'Some people when unwell lose track of time. Can you tell me today\'s date?',
        subQuestions: [
          'What day of the week is it?',
          'What month is it?',
          'What year is it?',
          'Where are we right now?',
        ],
        ratingType: 'severity',
        isScreening: true,
        clinicianNote: 'Ask date, day, month, year, and place. Rate based on number of errors.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 12. MEMORY
  // ─────────────────────────────────────────────
  {
    id: 'memory',
    name: 'Memory',
    icon: '💭',
    screeningQuestionIds: ['memory_main'],
    questions: [
      {
        id: 'memory_main',
        category: 'Memory',
        question: 'Have you had any difficulties with your memory?',
        subQuestions: [
          'Is that a problem for you in daily life?',
          'Do you forget recent events more than past ones?',
        ],
        ratingType: 'severity',
        isScreening: true,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 13. ALCOHOL MISUSE
  // ─────────────────────────────────────────────
  {
    id: 'alcohol',
    name: 'Alcohol Use',
    icon: '🍷',
    screeningQuestionIds: ['alcohol_main'],
    questions: [
      {
        id: 'alcohol_main',
        category: 'Alcohol',
        question: 'May I ask about your drinking habits? How much alcohol do you drink?',
        subQuestions: [
          'Do you have a strong urge or craving to drink every day?',
          'Can you stop after one or two drinks?',
          'Has the amount you drink increased over time?',
          'Have you experienced shaking, sweating, or anxiety when not drinking?',
        ],
        ratingType: 'alcohol',
        isScreening: true,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 14. DRUG MISUSE
  // ─────────────────────────────────────────────
  {
    id: 'drugs',
    name: 'Drug Use',
    icon: '💊',
    screeningQuestionIds: ['drugs_main'],
    questions: [
      {
        id: 'drugs_main',
        category: 'Drugs',
        question: 'Do you take any drugs not prescribed by your doctor?',
        subQuestions: [
          'What kind of drugs?',
          'How much and how often do you take them?',
          'Do you suffer withdrawal symptoms if you stop?',
        ],
        ratingType: 'drug',
        isScreening: true,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 15. PERSONALITY
  // ─────────────────────────────────────────────
  {
    id: 'personality',
    name: 'Personality',
    icon: '🎭',
    screeningQuestionIds: ['personality_main'],
    questions: [
      {
        id: 'personality_main',
        category: 'Personality',
        question: 'Have you had long-standing problems in the way you behave towards others, causing difficulties?',
        subQuestions: [
          'Problems in relationships, at work, or with the law?',
          'Has that been going on since you were young?',
          'Has it continued throughout your life?',
        ],
        ratingType: 'personality',
        isScreening: true,
        clinicianNote: 'This should reflect enduring patterns from early adulthood, not just recent behaviour.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 16. STRESSORS
  // ─────────────────────────────────────────────
  {
    id: 'stress',
    name: 'Stressors',
    icon: '😓',
    screeningQuestionIds: ['stress_main'],
    questions: [
      {
        id: 'stress_main',
        category: 'Stressors',
        question: 'Have you experienced any significant stress or traumatic events around the time your problems started?',
        subQuestions: [
          'Has anyone close to you died?',
          'Break-up of a relationship?',
          'Serious accident or illness?',
          'Any other stressful life event?',
        ],
        ratingType: 'stress',
        isScreening: true,
      },
    ],
  },
];

export const getAllQuestions = () => {
  return assessmentCategories.flatMap(cat => cat.questions);
};

export const getTotalQuestions = () => {
  return getAllQuestions().length;
};

// Returns the rating options for a given ratingType
export const getRatingsForType = (type: AssessmentQuestion['ratingType']) => {
  switch (type) {
    case 'alcohol': return alcoholRatings;
    case 'drug': return drugRatings;
    case 'stress': return stressRatings;
    default: return severityRatings;
  }
};
