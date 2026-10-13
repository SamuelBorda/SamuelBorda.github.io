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
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#fcee0a', '#00f0ff', '#ff003c'],
    });

    setSent(true);
    const subject = encodeURIComponent(`[Portafolio Dev] Contacto de ${formData.name}`);
    const body = encodeURIComponent(`${formData.message}\n\nContacto: ${formData.email}`);
    window.location.href = `mailto:${userProfile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0a0c12] border border-[#fcee0a]/50 text-[#fcee0a] text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-[#fcee0a] animate-pulse"></span>
            <span>TRANSMISIÓN // CANAL DIRECTO</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight mb-4">
            Iniciar <br />
            <span className="text-[#00f0ff] glow-cyan">Conexión</span>
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light">
            Disponible para desarrollo de sistemas, proyectos fullstack en Laravel, Next.js, Node.js y colaboraciones de alto calibre. Establece contacto a través del dataterm.
          </p>

          {/* Social Links */}
          <div className="space-y-3 font-mono text-xs">
            <a
              href={`mailto:${userProfile.email}`}
              onClick={() => soundManager.playClick()}
              className="p-3.5 bg-[#0a0c12]/90 border border-slate-800 hover:border-[#fcee0a] flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
            >
              <div className="p-2 bg-yellow-950/40 text-[#fcee0a] group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Canal de Correo</div>
                <div className="text-xs font-semibold">{userProfile.email}</div>
              </div>
            </a>

            <a
              href={userProfile.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="p-3.5 bg-[#0a0c12]/90 border border-slate-800 hover:border-[#00f0ff] flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
            >
              <div className="p-2 bg-cyan-950/40 text-[#00f0ff] group-hover:scale-110 transition-transform">
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
              className="p-3.5 bg-[#0a0c12]/90 border border-slate-800 hover:border-[#ff003c] flex items-center gap-3 text-slate-300 hover:text-white transition-all group"
            >
              <div className="p-2 bg-rose-950/40 text-[#ff003c] group-hover:scale-110 transition-transform">
                <LinkedinIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase">Red Profesional</div>
                <div className="text-xs font-semibold">LinkedIn Profile</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <div className="p-8 bg-[#080a10]/55 border border-slate-800/80 backdrop-blur-md relative shadow-2xl clip-cyber">
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-slate-800 font-mono text-xs text-[#00f0ff]">
              <MessageSquare className="w-4 h-4" />
              <span>TERMINAL DE TRANSMISIÓN // FORMULARIO</span>
            </div>

            {sent ? (
              <div className="py-12 text-center font-mono">
                <CheckCircle2 className="w-12 h-12 text-[#fcee0a] mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white mb-2">¡TRANSMISIÓN ENVIADA!</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Paquete de datos despachado. Responderé en la mayor brevedad.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-4 py-2 bg-slate-900 text-slate-300 text-xs border border-slate-700 hover:border-[#00f0ff]"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    Nombre o Empresa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Night City Tech / David"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#050608] border border-slate-800 focus:border-[#00f0ff] focus:outline-none text-slate-100 placeholder:text-slate-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    Correo de Contacto
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tu-email@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#050608] border border-slate-800 focus:border-[#00f0ff] focus:outline-none text-slate-100 placeholder:text-slate-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    Mensaje / Requerimientos
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Detalles del proyecto, arquitectura o propuesta..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[#050608] border border-slate-800 focus:border-[#00f0ff] focus:outline-none text-slate-100 placeholder:text-slate-600 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => soundManager.playHover()}
                  className="w-full py-3.5 bg-[#fcee0a] hover:bg-yellow-300 text-slate-950 font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] clip-cyber-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMITIR MENSAJE // ENVIAR</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
