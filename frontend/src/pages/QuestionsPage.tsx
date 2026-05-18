import { useState } from 'react';
import { ANSWER_OPTIONS } from '../types';
import ProgressBar from '../components/ProgressBar';

const QUESTIONS = [
  { id: 1, text: '¿{name} cuestiona las reglas y necesita saber el "por qué" de cada cosa?' },
  { id: 2, text: '¿{name} absorbe las emociones de los demás como si fueran propias?' },
  { id: 3, text: '¿{name} irradia una alegría contagiosa y trae luz a todos a su alrededor?' },
  { id: 4, text: '¿{name} demuestra sabiduría o conocimientos que parecen ir más allá de su edad?' },
  { id: 5, text: '¿{name} tiene un fuerte sentido de justicia y se rebela ante situaciones injustas?' },
  { id: 6, text: '¿{name} prefiere ambientes tranquilos y se afecta mucho con el ruido o el caos?' },
  { id: 7, text: '¿{name} da sin esperar nada a cambio, compartiendo naturalmente sus cosas?' },
  { id: 8, text: '¿{name} parece aprender ciertas habilidades sin necesidad de enseñanza formal?' },
  { id: 9, text: '¿{name} tiene dificultades con sistemas educativos o estructuras convencionales?' },
  { id: 10, text: '¿{name} tiene una conexión especial con la naturaleza, los animales o las plantas?' },
  { id: 11, text: '¿{name} tiene una energía muy alta, positiva y transformadora en su ambiente?' },
  { id: 12, text: '¿{name} habla de sueños vívidos, experiencias espirituales o "recuerdos" inusuales?' },
];

interface Props {
  childName: string;
  childSex: string;
  onSubmit: (answers: number[]) => void;
  onBack: () => void;
}

export default function QuestionsPage({ childName, childSex: _childSex, onSubmit, onBack }: Props) {
  const [answers, setAnswers] = useState<number[]>(Array(12).fill(-1));
  const [currentQ, setCurrentQ] = useState(0);

  const question = QUESTIONS[currentQ].text.replace(/{name}/g, childName);
  const answered = answers[currentQ] !== -1;
  const allAnswered = answers.every(a => a !== -1);

  const selectAnswer = (value: number) => {
    const updated = [...answers];
    updated[currentQ] = value;
    setAnswers(updated);
    if (currentQ < 11) {
      setTimeout(() => setCurrentQ(prev => prev + 1), 300);
    }
  };

  const handleSubmit = () => {
    if (allAnswered) onSubmit(answers);
  };

  const answeredCount = answers.filter(a => a !== -1).length;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        <div className="text-center mb-8">
          <p className="font-montserrat text-xs text-dorado/70 uppercase tracking-widest mb-2">12 preguntas sobre {childName}</p>
          <h2 className="font-cormorant text-3xl text-stone">Perfil de vibración</h2>
        </div>

        <div className="mb-8">
          <ProgressBar current={answeredCount} total={12} />
        </div>

        {/* Pregunta actual */}
        <div className="card p-7 mb-6">
          <div className="text-center mb-6">
            <span className="font-montserrat text-xs text-sage/80 uppercase tracking-widest">Pregunta {currentQ + 1}</span>
            <p className="font-cormorant text-2xl text-stone mt-3 leading-relaxed">{question}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ANSWER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => selectAnswer(opt.value)}
                className={`py-4 px-4 rounded-xl font-montserrat text-sm transition-all duration-200 border text-center ${
                  answers[currentQ] === opt.value
                    ? 'bg-dorado text-white border-dorado font-semibold shadow-md shadow-dorado/20'
                    : 'border-stone/15 text-muted bg-white hover:border-dorado/40 hover:text-stone hover:bg-sand/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => currentQ > 0 ? setCurrentQ(prev => prev - 1) : onBack()}
            className="btn-secondary text-sm"
          >
            ← {currentQ === 0 ? 'Atrás' : 'Anterior'}
          </button>

          <div className="flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === currentQ ? 'bg-dorado scale-125' :
                  answers[i] !== -1 ? 'bg-sage' : 'bg-stone/20'
                }`}
              />
            ))}
          </div>

          {currentQ < 11 ? (
            <button
              onClick={() => setCurrentQ(prev => Math.min(prev + 1, 11))}
              disabled={!answered}
              className="btn-secondary text-sm disabled:opacity-30"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="btn-primary text-sm disabled:opacity-30"
            >
              Generar lectura ✦
            </button>
          )}
        </div>

        <p className="font-montserrat text-xs text-muted/60 text-center mt-6 leading-relaxed">
          No hay respuestas correctas o incorrectas — responde desde tu corazón basándote en tu observación diaria de {childName}.
        </p>
      </div>
    </div>
  );
}
