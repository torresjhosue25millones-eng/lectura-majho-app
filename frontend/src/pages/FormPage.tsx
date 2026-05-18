import { useState } from 'react';
import { FormData } from '../types';

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Intro */}
        <div className="text-center mb-10">
          <div className="float inline-block text-5xl mb-4">🌟</div>
          <h2 className="font-cormorant text-4xl md:text-5xl text-stone mb-3">Lectura Astral</h2>
          <p className="font-cormorant text-xl text-dorado italic mb-4">Descubre la misión de tu hijo/a</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-dorado to-transparent mx-auto mb-4" />
          <p className="font-montserrat text-sm text-muted max-w-md mx-auto leading-relaxed">
            Completa este formulario con los datos de nacimiento de tu niño/a.
            Recibirás su reporte astral completo en tu correo electrónico.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Sección Mamá */}
          <div className="card p-6">
            <h3 className="font-cormorant text-2xl text-dorado mb-5 flex items-center gap-2">
              <span>💛</span> Tus datos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Tu nombre</label>
                <input
                  type="text"
                  className={`input-field ${errors.momName ? 'border-red-400' : ''}`}
                  placeholder="Ej: María García"
                  value={form.momName}
                  onChange={e => update('momName', e.target.value)}
                />
                {errors.momName && <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.momName}</p>}
              </div>
              <div>
                <label className="label">Tu correo electrónico</label>
                <input
                  type="email"
                  className={`input-field ${errors.momEmail ? 'border-red-400' : ''}`}
                  placeholder="tu@correo.com"
                  value={form.momEmail}
                  onChange={e => update('momEmail', e.target.value)}
                />
                {errors.momEmail && <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.momEmail}</p>}
              </div>
            </div>
          </div>

          {/* Sección Niño */}
          <div className="card p-6">
            <h3 className="font-cormorant text-2xl text-dorado mb-5 flex items-center gap-2">
              <span>✨</span> Datos del niño/a
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre del niño/a</label>
                <input
                  type="text"
                  className={`input-field ${errors.childName ? 'border-red-400' : ''}`}
                  placeholder="Ej: Lucas"
                  value={form.childName}
                  onChange={e => update('childName', e.target.value)}
                />
                {errors.childName && <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.childName}</p>}
              </div>

              <div>
                <label className="label">Sexo</label>
                <div className="flex gap-3 mt-1">
                  {[{ value: 'M', label: '♂ Niño' }, { value: 'F', label: '♀ Niña' }].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update('childSex', opt.value)}
                      className={`flex-1 py-3 rounded-xl font-montserrat text-sm transition-all duration-200 border ${
                        form.childSex === opt.value
                          ? 'bg-dorado text-white border-dorado font-semibold shadow-sm'
                          : 'border-stone/20 text-muted hover:border-dorado/50 hover:text-stone bg-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Fecha de nacimiento</label>
                <input
                  type="date"
                  className={`input-field ${errors.birthDate ? 'border-red-400' : ''}`}
                  value={form.birthDate}
                  onChange={e => update('birthDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.birthDate && <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.birthDate}</p>}
              </div>

              <div>
                <label className="label">Hora de nacimiento</label>
                <input
                  type="time"
                  className={`input-field ${errors.birthTime ? 'border-red-400' : ''}`}
                  value={form.birthTime}
                  onChange={e => update('birthTime', e.target.value)}
                />
                {errors.birthTime && <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.birthTime}</p>}
                <p className="font-montserrat text-xs text-muted/70 mt-1">Hora local de nacimiento (ej: 14:30)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="label">Ciudad de nacimiento</label>
                <input
                  type="text"
                  className={`input-field ${errors.birthCity ? 'border-red-400' : ''}`}
                  placeholder="Ej: Bogotá"
                  value={form.birthCity}
                  onChange={e => update('birthCity', e.target.value)}
                />
                {errors.birthCity && <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.birthCity}</p>}
              </div>

              <div>
                <label className="label">País de nacimiento</label>
                <select
                  className={`input-field ${errors.birthCountry ? 'border-red-400' : ''}`}
                  value={form.birthCountry}
                  onChange={e => update('birthCountry', e.target.value)}
                  style={{ color: form.birthCountry ? '#3D3025' : '#7A6A5A' }}
                >
                  <option value="" style={{ color: '#7A6A5A' }}>Selecciona un país...</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c} style={{ color: '#3D3025' }}>{c}</option>
                  ))}
                </select>
                {errors.birthCountry && <p className="text-red-500 text-xs mt-1 font-montserrat">{errors.birthCountry}</p>}
              </div>
            </div>
          </div>

          {/* Qué esperar */}
          <div className="border border-dorado/25 rounded-2xl p-5 bg-sand/60">
            <p className="font-montserrat text-xs text-dorado uppercase tracking-widest mb-3">Lo que recibirás</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Carta astral completa', 'Sol, Luna y Ascendente', 'Las 12 casas', 'Tipo de vibración', 'Propósito de vida', 'Consejos MAJHO'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-sage text-xs">✓</span>
                  <span className="font-montserrat text-xs text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full text-base py-4">
            Continuar a las preguntas →
          </button>
        </form>
      </div>
    </div>
  );
}
