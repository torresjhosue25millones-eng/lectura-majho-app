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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem', fontWeight: 600 }}>
            12 preguntas sobre {childName}
          </p>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.875rem', color: '#000000' }}>
            Perfil de vibración
          </h2>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <ProgressBar current={answeredCount} total={12} />
        </div>

        {/* Pregunta actual */}
        <div style={{
          backgroundColor: '#C4A882',
          border: '1px solid rgba(155, 120, 60, 0.35)',
          borderRadius: '1rem',
          padding: '1.75rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 10px rgba(155, 120, 60, 0.2)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              Pregunta {currentQ + 1}
            </span>
            <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.5rem', color: '#000000', marginTop: '0.75rem', lineHeight: 1.5 }}>
              {question}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {ANSWER_OPTIONS.map(opt => {
              const isSelected = answers[currentQ] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(opt.value)}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isSelected ? '2px solid #B8935A' : '1.5px solid rgba(255, 255, 255, 0.55)',
                    backgroundColor: isSelected ? '#B8935A' : '#ffffff',
                    color: '#000000',
                    fontWeight: isSelected ? 600 : 400,
                    boxShadow: isSelected ? '0 3px 10px rgba(184, 147, 90, 0.35)' : 'none',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navegación */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <button
            onClick={() => currentQ > 0 ? setCurrentQ(prev => prev - 1) : onBack()}
            className="btn-secondary"
            style={{ fontSize: '0.875rem' }}
          >
            ← {currentQ === 0 ? 'Atrás' : 'Anterior'}
          </button>

          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: i === currentQ ? '#B8935A' :
                    answers[i] !== -1 ? '#7A9E7E' : 'rgba(61, 43, 31, 0.18)',
                  transform: i === currentQ ? 'scale(1.35)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          {currentQ < 11 ? (
            <button
              onClick={() => setCurrentQ(prev => Math.min(prev + 1, 11))}
              disabled={!answered}
              className="btn-secondary"
              style={{ fontSize: '0.875rem' }}
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="btn-primary"
              style={{ fontSize: '0.875rem' }}
            >
              Generar lectura ✦
            </button>
          )}
        </div>

        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', color: '#000000', textAlign: 'center', marginTop: '1.5rem', lineHeight: 1.6 }}>
          No hay respuestas correctas o incorrectas — responde desde tu corazón basándote en tu observación diaria de {childName}.
        </p>
      </div>
    </div>
  );
}
