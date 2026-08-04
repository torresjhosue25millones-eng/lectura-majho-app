import { useState } from 'react';
import { FormData, AppState } from './types';
import StarBackground from './components/StarBackground';
import Header from './components/Header';
import FormPage from './pages/FormPage';
import QuestionsPage from './pages/QuestionsPage';
import ThankYouPage from './pages/ThankYouPage';
import axios from 'axios';

const INITIAL_FORM: FormData = {
  momName: '', momEmail: '', childName: '', childSex: 'M',
  birthDate: '', birthTime: '', birthCity: '', birthCountry: '',
};

function getTokenFromUrl(): string {
  return new URLSearchParams(window.location.search).get('token') || '';
}

export default function App() {
  const [token] = useState<string>(getTokenFromUrl);
  const [state, setState] = useState<AppState>({
    formData: INITIAL_FORM,
    answers: [],
    step: token ? 'form' : 'error',
    errorMessage: token
      ? undefined
      : 'Este enlace no es válido. Si ya compraste tu Lectura Astral MAJHO, revisa el correo que te enviamos con tu link personal.',
  });

  const handleFormSubmit = (formData: FormData) => {
    setState(prev => ({ ...prev, formData, step: 'questions' }));
  };

  const handleQuestionsSubmit = async (answers: number[]) => {
    try {
      await axios.post('/api/reading', { ...state.formData, answers, token });
      setState(prev => ({ ...prev, answers, step: 'done' }));
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.error || 'Error al generar la lectura. Por favor intenta nuevamente.')
        : 'Error de conexión. Verifica tu internet e intenta nuevamente.';
      setState(prev => ({ ...prev, answers, step: 'error', errorMessage: message }));
    }
  };

  const handleRetry = () => {
    if (!token) return; // sin token válido no hay a dónde reintentar
    setState(prev => ({ ...prev, step: 'form', formData: INITIAL_FORM, answers: [] }));
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <StarBackground />
      <div className="relative z-10">
        <Header />
        <main>
          {state.step === 'form' && (
            <FormPage onSubmit={handleFormSubmit} initialData={state.formData} />
          )}
          {state.step === 'questions' && (
            <QuestionsPage
              childName={state.formData.childName}
              childSex={state.formData.childSex}
              onSubmit={handleQuestionsSubmit}
              onBack={() => setState(prev => ({ ...prev, step: 'form' }))}
            />
          )}
          {(state.step === 'done' || state.step === 'error') && (
            <ThankYouPage
              childName={state.formData.childName}
              momEmail={state.formData.momEmail}
              success={state.step === 'done'}
              errorMessage={state.errorMessage}
              onRetry={handleRetry}
            />
          )}
        </main>
      </div>
    </div>
  );
}
