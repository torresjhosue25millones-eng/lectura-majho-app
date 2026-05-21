export interface FormData {
  momName: string;
  momEmail: string;
  childName: string;
  childSex: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  birthCountry: string;
}

export interface AppState {
  formData: FormData;
  answers: number[];
  step: 'form' | 'questions' | 'done' | 'error';
  errorMessage?: string;
}

export const ANSWER_OPTIONS = [
  { value: 3, label: 'Siempre' },
  { value: 2, label: 'A veces' },
  { value: 1, label: 'Raramente' },
  { value: 0, label: 'Nunca' },
];
