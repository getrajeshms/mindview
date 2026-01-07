export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  subQuestions?: string[];
  ratingType: 'severity' | 'alcohol' | 'drug' | 'personality' | 'stress' | 'yesno';
}

export interface AssessmentCategory {
  id: string;
  name: string;
  icon: string;
  questions: AssessmentQuestion[];
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
  {
    id: 'worries',
    name: 'Worries & Anxiety',
    icon: '😟',
    questions: [
      {
        id: 'worries',
        category: 'Worries',
        question: 'Do you tend to worry a lot?',
        subQuestions: ['What kind of things do you worry about?', 'What about money or family problems, your own health or someone else\'s health?'],
        ratingType: 'severity',
      },
      {
        id: 'anxiety',
        category: 'Anxiety',
        question: 'Do you get frightened or nervous?',
        subQuestions: ['Do you get palpitations?', 'Sweating?', 'Trembling/shaking?', 'Restless feelings in stomach?'],
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'concentration',
    name: 'Concentration',
    icon: '🧠',
    questions: [
      {
        id: 'concentration',
        category: 'Concentration',
        question: 'How is your concentration?',
        subQuestions: ['Can you concentrate on talking to someone, or listening to radio, watching TV, or reading?'],
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'depression',
    name: 'Depression',
    icon: '😔',
    questions: [
      {
        id: 'depressed_mood',
        category: 'Depressed Mood',
        question: 'Have you been sad (depressed) recently?',
        subQuestions: ['Have you cried at all or felt like crying?', 'Is the depression there most of the time or just a few hours?'],
        ratingType: 'severity',
      },
      {
        id: 'loss_of_interest',
        category: 'Loss of Interest',
        question: 'How is your interest in things? Have you lost interest in things?',
        subQuestions: ['What have you enjoyed doing recently?'],
        ratingType: 'severity',
      },
      {
        id: 'sleep',
        category: 'Sleep',
        question: 'Have you had trouble sleeping recently?',
        subQuestions: ['Do you have difficulties falling asleep?', 'Do you wake up early in the morning?', 'Have you been sleeping more than usual?'],
        ratingType: 'severity',
      },
      {
        id: 'appetite',
        category: 'Appetite',
        question: 'What has your appetite been like?',
        subQuestions: ['Do you enjoy your food?', 'Have you been eating more or less than usual?'],
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'eating',
    name: 'Eating Disorders',
    icon: '🍽️',
    questions: [
      {
        id: 'eating_concern',
        category: 'Eating Concern',
        question: 'Are you UNDULY concerned about eating fattening food?',
        subQuestions: ['Differentiate between normal/general concern and excessive concern'],
        ratingType: 'severity',
      },
      {
        id: 'body_image',
        category: 'Body Image',
        question: 'Do you believe yourself to be fat when others say you are too thin?',
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'health_anxiety',
    name: 'Health Anxiety',
    icon: '🏥',
    questions: [
      {
        id: 'hypochondriasis',
        category: 'Health Anxiety',
        question: 'Do you worry about your health or any illness?',
        subQuestions: ['Is there anything about your body which bothers or upsets you?', 'Are you in pain?', 'Is any part of your body not working properly?'],
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'ocd',
    name: 'Obsessive Compulsive',
    icon: '🔄',
    questions: [
      {
        id: 'obsessions',
        category: 'Obsessions/Compulsions',
        question: 'Do you have to check things over and over again?',
        subQuestions: ['For example, whether you have turned off taps, gas, lights, or locked your door?', 'Do you wash your hands a lot?', 'Do unwanted thoughts come to your head and will not go away?'],
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'phobia',
    name: 'Phobias',
    icon: '😰',
    questions: [
      {
        id: 'agoraphobia',
        category: 'Phobias',
        question: 'Do you have fears you know don\'t make sense?',
        subQuestions: ['Like being afraid of crowds, going out alone, or using public transport?', 'Do you have any other fears?'],
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'mania',
    name: 'Manic Behaviour',
    icon: '⚡',
    questions: [
      {
        id: 'mania_energy',
        category: 'Mania - Energy',
        question: 'Has there been a time recently when you have felt almost too energetic?',
        ratingType: 'severity',
      },
      {
        id: 'mania_mood',
        category: 'Mania - Mood',
        question: 'Have you been feeling very happy recently for no apparent reason?',
        subQuestions: ['Observe for disinhibited social behaviour, grandiose beliefs, excessive talking, racing thoughts'],
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'psychosis',
    name: 'Psychosis',
    icon: '🌀',
    questions: [
      {
        id: 'thought_disorder',
        category: 'Thought Disorder',
        question: 'Can you think clearly/straight?',
        subQuestions: ['Do your thoughts get mixed up or muddled?', 'Observe for disorganised and illogical thinking'],
        ratingType: 'severity',
      },
      {
        id: 'delusions',
        category: 'Delusions',
        question: 'Do you believe that people talk about you, laugh at you, or that TV/Radio refers to you?',
        subQuestions: ['Do you have any unusual ideas or beliefs?', 'For example, people are going to harm you?'],
        ratingType: 'severity',
      },
      {
        id: 'auditory_hallucinations',
        category: 'Auditory Hallucinations',
        question: 'Do you hear things other people cannot hear?',
        subQuestions: ['What about voices when there is no one about?', 'What did they say?', 'How often does it happen?'],
        ratingType: 'severity',
      },
      {
        id: 'visual_hallucinations',
        category: 'Visual Hallucinations',
        question: 'Do you have visions or see things that are invisible to other people?',
        subQuestions: ['How often does it happen?'],
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'disorientation',
    name: 'Disorientation',
    icon: '🧭',
    questions: [
      {
        id: 'time_orientation',
        category: 'Time Orientation',
        question: 'Some people when unwell lose track of time. Can you tell me today\'s date?',
        subQuestions: ['What day of the week is it?', 'What month?', 'What year?'],
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'memory',
    name: 'Memory',
    icon: '💭',
    questions: [
      {
        id: 'memory',
        category: 'Memory',
        question: 'Have you had any difficulties with your memory?',
        subQuestions: ['Is that a problem for you?'],
        ratingType: 'severity',
      },
    ],
  },
  {
    id: 'substance',
    name: 'Substance Use',
    icon: '🍷',
    questions: [
      {
        id: 'alcohol',
        category: 'Alcohol',
        question: 'May I ask about your drinking habits? How much do you drink?',
        subQuestions: ['Do you have a strong desire to drink every day?', 'Can you stop after one or two drinks?', 'Has the amount increased over time?', 'Have you had withdrawal symptoms?'],
        ratingType: 'alcohol',
      },
      {
        id: 'drugs',
        category: 'Drugs',
        question: 'Do you take any drugs not prescribed by your doctor?',
        subQuestions: ['What kind of drugs?', 'How much do you take?', 'Do you suffer from withdrawal symptoms?'],
        ratingType: 'drug',
      },
    ],
  },
  {
    id: 'personality',
    name: 'Personality',
    icon: '🎭',
    questions: [
      {
        id: 'personality',
        category: 'Personality',
        question: 'Have you had problems in the way you behave towards others causing difficulties?',
        subQuestions: ['Problems in relationships, at work, or with law?', 'Has that been going on since you were young?', 'Has it continued throughout your life?'],
        ratingType: 'personality',
      },
    ],
  },
  {
    id: 'stress',
    name: 'Stress Level',
    icon: '😓',
    questions: [
      {
        id: 'stress',
        category: 'Stress',
        question: 'Have you been in any kind of stress/traumatic experience before your problems started?',
        subQuestions: ['Anyone close to you died?', 'Break-up of a relationship?', 'Serious accident?', 'Any other stressful event?'],
        ratingType: 'stress',
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
