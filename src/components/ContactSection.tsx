import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, CheckCircle2, MessageSquare, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react';
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
    const subject = encodeURIComponent(`[Contacto Portafolio] Propuesta de ${formData.name}`);
    const body = encodeURIComponent(`${formData.message}\n\nContacto: ${formData.email}`);
    window.location.href = `mailto:${userProfile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 px-4 max-w-7xl mx-auto scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Info & Quick Channels */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#00f0ff] text-xs font-mono mb-4 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>03 // Conexión Directa</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            ¿Tienes un proyecto <br />
            <span className="text-[#fcee0a]">en mente?</span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 font-light">
            Disponible para desarrollo de software web fullstack, APIs de backend en Laravel y Node.js, aplicaciones en tiempo real e integraciones escalables. Escríbeme directamente por WhatsApp o correo.
          </p>

          {/* Contact Direct Cards */}
          <div className="space-y-2.5 font-mono text-xs">
            {/* Email */}
            <a
              href={`mailto:${userProfile.email}`}
              onClick={() => soundManager.playClick()}
              className="p-4 rounded-2xl bg-[#080914]/75 border border-white/10 hover:border-[#fcee0a]/50 flex items-center justify-between text-zinc-300 hover:text-white transition-all group backdrop-blur-xl"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className="p-2.5 rounded-xl bg-yellow-400/10 text-[#fcee0a] group-hover:scale-105 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Correo Electrónico</div>
                  <div className="text-xs font-semibold text-white truncate">{userProfile.email}</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#fcee0a] transition-colors" />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/59176401404"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="p-4 rounded-2xl bg-[#080914]/75 border border-white/10 hover:border-emerald-400/50 flex items-center justify-between text-zinc-300 hover:text-white transition-all group backdrop-blur-xl"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-400/10 text-emerald-400 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">WhatsApp & Celular</div>
                  <div className="text-xs font-semibold text-white">+591 76401404 / +591 72749686</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            </a>

            {/* Location */}
            <div className="p-4 rounded-2xl bg-[#080914]/75 border border-white/10 flex items-center gap-3.5 text-zinc-300 backdrop-blur-xl">
              <div className="p-2.5 rounded-xl bg-cyan-400/10 text-[#00f0ff]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Ubicación</div>
                <div className="text-xs font-semibold text-white">Cochabamba, Bolivia (Remoto / Presencial)</div>
              </div>
            </div>

            {/* GitHub & LinkedIn row */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href={userProfile.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="p-3.5 rounded-2xl bg-[#080914]/75 border border-white/10 hover:border-[#00f0ff]/50 flex items-center gap-2.5 text-zinc-300 hover:text-white transition-all group backdrop-blur-xl"
              >
                <GithubIcon className="w-4 h-4 text-[#00f0ff]" />
                <span className="text-xs font-semibold">GitHub</span>
              </a>

              <a
                href={userProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
                className="p-3.5 rounded-2xl bg-[#080914]/75 border border-white/10 hover:border-[#ff003c]/50 flex items-center gap-2.5 text-zinc-300 hover:text-white transition-all group backdrop-blur-xl"
              >
                <LinkedinIcon className="w-4 h-4 text-[#ff003c]" />
                <span className="text-xs font-semibold">LinkedIn</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Message Transmission Terminal Form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <div className="p-7 sm:p-9 rounded-3xl backdrop-blur-2xl bg-[#080a14]/80 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08] font-mono text-xs">
              <span className="text-[#00f0ff] flex items-center gap-1.5 font-bold">
                <MessageSquare className="w-4 h-4" /> FORMULARIO DE MENSAJE DIRECTO
              </span>
              <span className="text-zinc-500 text-[11px]">Respuesta rápida</span>
            </div>

            {sent ? (
              <div className="py-12 text-center font-mono">
                <CheckCircle2 className="w-12 h-12 text-[#fcee0a] mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white mb-2">¡MENSAJE ENVIADO!</h3>
                <p className="text-zinc-400 text-xs max-w-sm mx-auto">
                  Tu cliente de correo se ha abierto con el mensaje. Responderé lo antes posible.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-5 py-2.5 rounded-full bg-white/[0.05] text-zinc-300 text-xs border border-white/10 hover:border-[#00f0ff] active:scale-95 transition-all cursor-pointer"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    Tu Nombre o Empresa
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo o empresa..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 focus:outline-none text-zinc-100 placeholder:text-zinc-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    Tu Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@dominio.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 focus:outline-none text-zinc-100 placeholder:text-zinc-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1.5 uppercase tracking-wider text-[11px]">
                    Detalles del Proyecto o Mensaje
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe las metas de tu sistema, requerimientos o propuesta laboral..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 focus:outline-none text-zinc-100 placeholder:text-zinc-600 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => soundManager.playHover()}
                  className="w-full py-3.5 rounded-xl bg-[#fcee0a] hover:bg-yellow-300 text-zinc-950 font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(252,238,10,0.3)] transition-all hover:scale-[1.01] active:scale-95 cursor-pointer font-mono"
                >
                  <Send className="w-4 h-4" />
                  <span>ENVIAR MENSAJE</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
