import React, { useState } from 'react';
import { Send, Mail, CheckCircle2, MessageSquare } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    soundManager.playSuccess();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#10b981', '#3b82f6'],
    });

    setSent(true);
    // User can customize mailto or their preferred form provider (Formspree/EmailJS)
    const subject = encodeURIComponent(`Mensaje de portafolio de ${formData.name}`);
    const body = encodeURIComponent(`${formData.message}\n\nContacto: ${formData.email}`);
    window.location.href = `mailto:${userProfile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Direct info & status */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>FRECUENCIA ABIERTA DE TRANSMISIÓN</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight mb-4">
            ¿Listo para <br />
            <span className="text-cyan-400 glow-cyan">Colaborar?</span>
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light">
            Estoy disponible para nuevos proyectos, puestos de desarrollo fullstack y consultorías en Laravel, Next.js, Node.js y React. Transmite tu mensaje y responderé en breve.
          </p>

          {/* Social Links */}
          <div className="space-y-3 font-mono text-xs">
            <a
              href={`mailto:${userProfile.email}`}
              onClick={() => soundManager.playClick()}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400 flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
            >
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Correo Electrónico</div>
                <div className="text-xs font-semibold">{userProfile.email}</div>
              </div>
            </a>

            <a
              href={userProfile.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400 flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:scale-110 transition-transform">
                <GithubIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Perfil de GitHub</div>
                <div className="text-xs font-semibold">{userProfile.github}</div>
              </div>
            </a>

            <a
              href={userProfile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400 flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
            >
              <div className="p-2 rounded-lg bg-blue-950 text-blue-400 group-hover:scale-110 transition-transform">
                <LinkedinIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Red Profesional</div>
                <div className="text-xs font-semibold">LinkedIn Profile</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right Column: Transmission Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl relative shadow-2xl">
            {/* Tech Corner accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>

            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800 font-mono text-xs text-cyan-400">
              <MessageSquare className="w-4 h-4" />
              <span>TERMINAL DE ENVÍO DIRECTO</span>
            </div>

            {sent ? (
              <div className="py-12 text-center font-mono">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white mb-2">¡TRANSMISIÓN ENVIADA!</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Se ha generado la conexión. Responderé a tu canal lo antes posible.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-4 py-2 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    Tu Nombre o Compañía
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Alex Vance / Tech Corp"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none text-slate-100 placeholder:text-slate-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    Tu Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tu-email@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none text-slate-100 placeholder:text-slate-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    Mensaje / Misión
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe los requerimientos del proyecto o la propuesta..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none text-slate-100 placeholder:text-slate-600 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => soundManager.playHover()}
                  className="w-full py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMITIR MENSAJE</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
