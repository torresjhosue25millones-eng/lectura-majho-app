import { useState } from 'react';
import { FormData } from '../types';

function LogoImg() {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src="/assets/logo-majho.png"
      alt="Academia MAJHO"
      style={{ width: 200, height: 'auto' }}
      onError={() => setFailed(true)}
    />
  );
}

interface Props {
  onSubmit: (data: FormData) => void;
  initialData: FormData;
}

const COUNTRIES = [
  'Colombia', 'México', 'Argentina', 'Perú', 'Chile', 'Venezuela', 'Ecuador', 'Bolivia',
  'Paraguay', 'Uruguay', 'República Dominicana', 'Cuba', 'Panamá', 'Costa Rica',
  'Guatemala', 'Honduras', 'Nicaragua', 'El Salvador', 'España', 'Estados Unidos',
  'Brasil', 'Otro',
];

const sectionStyle = {
  backgroundColor: '#C4A882',
  border: '1px solid rgba(155, 120, 60, 0.35)',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 2px 10px rgba(155, 120, 60, 0.2)',
};

const sectionTitleStyle = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '1.375rem',
  color: '#000000',
  marginBottom: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid rgba(122, 158, 126, 0.25)',
};

export default function FormPage({ onSubmit, initialData }: Props) {
  const [form, setForm] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.momName.trim()) newErrors.momName = 'Ingresa tu nombre';
    if (!form.momEmail.trim() || !/\S+@\S+\.\S+/.test(form.momEmail)) newErrors.momEmail = 'Ingresa un correo válido';
    if (!form.childName.trim()) newErrors.childName = 'Ingresa el nombre del niño/a';
    if (!form.birthDate) newErrors.birthDate = 'Ingresa la fecha de nacimiento';
    if (!form.birthTime) newErrors.birthTime = 'Ingresa la hora de nacimiento';
    if (!form.birthCity.trim()) newErrors.birthCity = 'Ingresa la ciudad de nacimiento';
    if (!form.birthCountry) newErrors.birthCountry = 'Selecciona el país';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '672px' }}>

        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <LogoImg />
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2.75rem', color: '#000000', marginBottom: '0.5rem' }}>
            Lectura Astral
          </h2>
          <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.25rem', fontStyle: 'italic', color: '#000000', marginBottom: '1rem' }}>
            Descubre la misión de tu hijo/a
          </p>
          <div style={{ width: '4rem', height: '1px', background: 'linear-gradient(to right, transparent, #C8A97E, transparent)', margin: '0 auto 1rem' }} />
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem', color: '#000000', maxWidth: '28rem', margin: '0 auto', lineHeight: 1.7 }}>
            Completa este formulario con los datos de nacimiento de tu niño/a.
            Recibirás su reporte astral completo en tu correo electrónico.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Sección Mamá */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>
              <span>💛</span> Tus datos
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="label">Tu nombre</label>
                <input
                  type="text"
                  className={`input-field${errors.momName ? ' border-red-400' : ''}`}
                  placeholder="Ej: María García"
                  value={form.momName}
                  onChange={e => update('momName', e.target.value)}
                />
                {errors.momName && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.momName}</p>}
              </div>
              <div>
                <label className="label">Tu correo electrónico</label>
                <input
                  type="email"
                  className={`input-field${errors.momEmail ? ' border-red-400' : ''}`}
                  placeholder="tu@correo.com"
                  value={form.momEmail}
                  onChange={e => update('momEmail', e.target.value)}
                />
                {errors.momEmail && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.momEmail}</p>}
              </div>
            </div>
          </div>

          {/* Sección Niño */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>
              <span>✨</span> Datos del niño/a
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="label">Nombre del niño/a</label>
                <input
                  type="text"
                  className={`input-field${errors.childName ? ' border-red-400' : ''}`}
                  placeholder="Ej: Lucas"
                  value={form.childName}
                  onChange={e => update('childName', e.target.value)}
                />
                {errors.childName && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.childName}</p>}
              </div>

              <div>
                <label className="label">Sexo</label>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                  {[{ value: 'M', label: '♂ Niño' }, { value: 'F', label: '♀ Niña' }].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('childSex', opt.value)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.875rem',
                        fontWeight: form.childSex === opt.value ? 600 : 400,
                        border: form.childSex === opt.value ? '2px solid #B8935A' : '1.5px solid rgba(255, 255, 255, 0.55)',
                        backgroundColor: form.childSex === opt.value ? '#B8935A' : '#ffffff',
                        color: form.childSex === opt.value ? '#3D2B1F' : '#7A6A5A',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: form.childSex === opt.value ? '0 2px 8px rgba(184, 147, 90, 0.35)' : 'none',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label className="label">Fecha de nacimiento</label>
                <input
                  type="date"
                  className={`input-field${errors.birthDate ? ' border-red-400' : ''}`}
                  value={form.birthDate}
                  onChange={e => update('birthDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.birthDate && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.birthDate}</p>}
              </div>

              <div>
                <label className="label">Hora de nacimiento</label>
                <input
                  type="time"
                  className={`input-field${errors.birthTime ? ' border-red-400' : ''}`}
                  value={form.birthTime}
                  onChange={e => update('birthTime', e.target.value)}
                />
                {errors.birthTime && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.birthTime}</p>}
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', color: '#000000', marginTop: '0.25rem' }}>
                  Hora local de nacimiento (ej: 14:30)
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label className="label">Ciudad de nacimiento</label>
                <input
                  type="text"
                  className={`input-field${errors.birthCity ? ' border-red-400' : ''}`}
                  placeholder="Ej: Bogotá"
                  value={form.birthCity}
                  onChange={e => update('birthCity', e.target.value)}
                />
                {errors.birthCity && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.birthCity}</p>}
              </div>

              <div>
                <label className="label">País de nacimiento</label>
                <select
                  className={`input-field${errors.birthCountry ? ' border-red-400' : ''}`}
                  value={form.birthCountry}
                  onChange={e => update('birthCountry', e.target.value)}
                  style={{ color: form.birthCountry ? '#3D2B1F' : 'rgba(61,43,31,0.4)' }}
                >
                  <option value="" style={{ color: '#000000' }}>Selecciona un país...</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c} style={{ color: '#000000' }}>{c}</option>
                  ))}
                </select>
                {errors.birthCountry && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.birthCountry}</p>}
              </div>
            </div>
          </div>

          {/* Qué esperar */}
          <div style={{
            border: '1.5px solid rgba(122, 158, 126, 0.5)',
            borderRadius: '1rem',
            padding: '1.25rem',
            backgroundColor: '#C4A882',
          }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '0.75rem' }}>
              Lo que recibirás
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
              {['Carta astral completa', 'Sol, Luna y Ascendente', 'Las 12 casas', 'Tipo de vibración', 'Propósito de vida', 'Consejos MAJHO'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#000000', fontSize: '0.875rem', fontWeight: 700 }}>✓</span>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem', color: '#000000' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '1rem 2rem' }}>
            Continuar a las preguntas →
          </button>
        </form>
      </div>
    </div>
  );
}
