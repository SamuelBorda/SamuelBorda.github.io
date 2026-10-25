import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, CornerDownLeft, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { userProfile } from '../data/profile';
import { curatedProjects } from '../data/projects';
import { detailedSkills } from '../data/skills';
import confetti from 'canvas-confetti';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  id: number;
  type: 'input' | 'output' | 'system' | 'success' | 'error';
  text: string;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 1,
      type: 'system',
      text: `TERMINAL CLI // INGENIERÍA DE SISTEMAS & FULLSTACK
SESIÓN AUTORIZADA: ${userProfile.name} [BOLIVIA]
Escribe "help" para ver los comandos operativos con ejecución en tiempo real.`,
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const executeCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    soundManager.playClick();
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const argStr = args.join(' ').toLowerCase();

    const newLogs: CommandLog[] = [
      ...logs,
      { id: Date.now(), type: 'input', text: `$ ${trimmed}` },
    ];

    switch (cmd) {
      case 'help':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `╔══════════════════════════════════════════════════════════════════╗
║                   COMANDOS OPERATIVOS DEL SISTEMA                ║
╠══════════════════════════════════════════════════════════════════╣
  • projects [filtro]     : Lista proyectos (ej: "projects laravel", "projects next")
  • open <id|nombre>      : Abre el repositorio de GitHub en una pestaña nueva
  • inspect <id|nombre>   : Muestra la arquitectura y ficha técnica del proyecto
  • skills [filtro]       : Consulta habilidades y años de experiencia (ej: "skills php")
  • scan / planets        : Telemetría orbital del fondo 3D en tiempo real
  • whoami                : Muestra la biografía y credenciales de Samuel
  • github                : Abre directamente https://github.com/SamuelBorda
  • contact <mensaje>     : Prepara un correo directo para iniciar conexión
  • clear                 : Limpia el historial de la pantalla
  • overclock             : Ejecuta prueba de rendimiento gráfico (FX)
╠══════════════════════════════════════════════════════════════════╣
║          [🛡] CIBERSEGURIDAD (DIPLOMADO & HARDENING WEB)         ║
╠══════════════════════════════════════════════════════════════════╣
  • pentest [target]      : Simula laboratorio Nmap (ej: "pentest localhost")
  • vuln-scan             : Auditoría OWASP Top 10 de la aplicación actual
  • cipher <texto>        : Demuestra AES-256 + derivación de clave (conceptual)
  • owasp                 : Referencia OWASP Top 10 con estado de mitigación`,
        });
        break;

      case 'projects':
      case 'ls':
      case 'repos':
        let list = curatedProjects;
        if (argStr) {
          list = curatedProjects.filter(
            (p) =>
              p.title.toLowerCase().includes(argStr) ||
              p.category.toLowerCase().includes(argStr) ||
              p.tags.some((t) => t.toLowerCase().includes(argStr))
          );
        }

        if (list.length === 0) {
          newLogs.push({
            id: Date.now() + 1,
            type: 'error',
            text: `[!] No se encontraron repositorios con el filtro: "${argStr}". Ejecuta "projects" para ver todos.`,
          });
        } else {
          const formatted = list
            .map(
              (p, i) =>
                `  [ID: ${i + 1}] ${p.title}
      • Categoría: ${p.category} | Arquitectura: ${p.architecture || 'Clean Code'}
      • Tags: ${p.tags.join(', ')}
      • Enlace: ${p.githubUrl}`
            )
            .join('\n\n');
          newLogs.push({
            id: Date.now() + 1,
            type: 'output',
            text: `REPOSITORIOS DISPONIBLES (${list.length}):\n${formatted}\n\n-> Usa "open <id>" (ej: "open 1") para abrir directamente el repositorio.`,
          });
        }
        break;

      case 'open':
        if (!args[0]) {
          newLogs.push({
            id: Date.now() + 1,
            type: 'error',
            text: 'Uso: open <número_de_id o nombre> (ej: open 1, open simuinv, open poketinder)',
          });
          break;
        }

        const idNum = parseInt(args[0], 10);
        let targetProj = !isNaN(idNum) && idNum >= 1 && idNum <= curatedProjects.length
          ? curatedProjects[idNum - 1]
          : curatedProjects.find((p) => p.title.toLowerCase().includes(args[0].toLowerCase()) || p.id.includes(args[0]));

        if (targetProj) {
          soundManager.playSuccess();
          window.open(targetProj.githubUrl, '_blank');
          newLogs.push({
            id: Date.now() + 1,
            type: 'success',
            text: `[✓] Lanzando repositorio: ${targetProj.title} -> ${targetProj.githubUrl}`,
          });
        } else {
          newLogs.push({
            id: Date.now() + 1,
            type: 'error',
            text: `[!] No se encontró el proyecto "${args[0]}". Ejecuta "projects" para ver los IDs válidos.`,
          });
        }
        break;

      case 'inspect':
        if (!args[0]) {
          newLogs.push({
            id: Date.now() + 1,
            type: 'error',
            text: 'Uso: inspect <id> (ej: inspect 1)',
          });
          break;
        }

        const insId = parseInt(args[0], 10);
        const insProj = !isNaN(insId) && insId >= 1 && insId <= curatedProjects.length
          ? curatedProjects[insId - 1]
          : curatedProjects.find((p) => p.title.toLowerCase().includes(args[0].toLowerCase()));

        if (insProj) {
          newLogs.push({
            id: Date.now() + 1,
            type: 'output',
            text: `FICHA TÉCNICA // ${insProj.title.toUpperCase()}
--------------------------------------------------
ID Identificador: ${insProj.id}
Categoría       : ${insProj.category}
Arquitectura    : ${insProj.architecture || 'MVC / Clean Architecture'}
Estado Deploy   : ${insProj.deployStatus || 'PRODUCTION'}
Descripción     : ${insProj.description}
Stack de Tags   : ${insProj.tags.join(' • ')}
Repositorio     : ${insProj.githubUrl}`,
          });
        } else {
          newLogs.push({
            id: Date.now() + 1,
            type: 'error',
            text: `No se encontró proyecto con "${args[0]}".`,
          });
        }
        break;

      case 'skills':
      case 'tech':
        let skillList = detailedSkills;
        if (argStr) {
          skillList = detailedSkills.filter(
            (s) =>
              s.name.toLowerCase().includes(argStr) ||
              s.category.includes(argStr) ||
              s.ecosystem.some((e) => e.toLowerCase().includes(argStr))
          );
        }

        const formattedSkills = skillList
          .map(
            (s) =>
              `  • ${s.name.padEnd(28)} [${s.years} años exp | ${s.levelPercent}%] -> ${s.highlight}`
          )
          .join('\n');

        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `ARSENAL TÉCNICO VERIFICADO (5 AÑOS DE TRAYECTORIA):\n${formattedSkills}`,
        });
        break;

      case 'planets':
      case 'scan':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `[📡] ESCANEO DE TELEMETRÍA CÓSMICA // SUBSISTEMA 3D:
  1. SOL CENTRAL     : [COORD: +80, +40, +100] // Temp: 5,778 K | Corona Solar Activa
  2. TIERRA (TERRA)  : [COORD: -38, -12, -40]  // Biosfera Activa | Capa de Nubes Rotatoria
  3. LUNA (LUNA)     : [ÓRBITA: Radio 24 u]    // Mareas gravitacionales enlazadas a Terra
  4. SATURNO         : [COORD: +50, +18, -90]  // Gigante Gaseoso | Sistema de Anillos Dobles
  5. MARTE (ARES)    : [COORD: -65, +35, -130] // Planeta Rojo | Casquetes de Hielo
  6. NEPTUNO         : [COORD: +75, -30, -170] // Gigante de Hielo | Metano Atmosférico
  7. FENÓMENOS FX    : Auroras cósmicas activas | Detección de meteoritos y naves de paso.

-> TIP: Haz click o tap directamente sobre los planetas en pantalla para interactuar con ellos.`,
        });
        break;

      case 'whoami':
      case 'about':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `IDENTIDAD // ${userProfile.name}
--------------------------------------------------
Profesión   : ${userProfile.title}
Rol         : ${userProfile.role}
Ubicación   : ${userProfile.location}
Contacto    : ${userProfile.email} | Tel: ${userProfile.phone}
Especialidad: Laravel, PHP 8, WebSockets en tiempo real, APIs RESTful, Next.js, React y bases de datos relacionales.
GitHub      : ${userProfile.github}
Bio         : ${userProfile.bio}`,
        });
        break;

      case 'exp':
      case 'experience':
        const expList = userProfile.experiences
          .map(
            (e) => `  • ${e.company} [${e.period}]\n    ${e.role}\n    ${e.description}`
          )
          .join('\n\n');
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `HISTORIAL DE TRAYECTORIA OPERACIONAL:\n${expList}`,
        });
        break;

      case 'github':
        soundManager.playSuccess();
        window.open(userProfile.github, '_blank');
        newLogs.push({
          id: Date.now() + 1,
          type: 'success',
          text: `Abriendo perfil oficial de GitHub: ${userProfile.github}`,
        });
        break;

      case 'contact':
        if (!argStr) {
          newLogs.push({
            id: Date.now() + 1,
            type: 'output',
            text: `Canales de contacto directo:
  • Correo electrónico : ${userProfile.email}
  • Perfil en GitHub    : ${userProfile.github}
  • Perfil en LinkedIn  : ${userProfile.linkedin}

-> Puedes ejecutar: contact Hola Samuel, me interesa tu perfil para un proyecto backend`,
          });
        } else {
          soundManager.playSuccess();
          const subject = encodeURIComponent('Contacto desde Netrunner CLI');
          const body = encodeURIComponent(argStr);
          window.location.href = `mailto:${userProfile.email}?subject=${subject}&body=${body}`;
          newLogs.push({
            id: Date.now() + 1,
            type: 'success',
            text: `[✓] Lanzando cliente de correo con el mensaje: "${argStr}"`,
          });
        }
        break;

      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'overclock':
        soundManager.playSuccess();
        confetti({
          particleCount: 140,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#fcee0a', '#00f0ff', '#ff003c'],
        });
        newLogs.push({
          id: Date.now() + 1,
          type: 'success',
          text: '⚡ [OVERCLOCK]: Frecuencia de bus al máximo. Protocolos visuales en sincronía.',
        });
        break;

      // ---- CYBERSECURITY MODULE ----
      case 'pentest': {
        const target = args[0] || 'portfolio.local';
        soundManager.playSuccess();
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `[🔍] NMAP RECON // Lab Diplomado Ciberseguridad // Target: ${target}
--------------------------------------------------
Starting Nmap 7.94 scan...

PORT     STATE   SERVICE      VERSION
22/tcp   closed  ssh
80/tcp   open    http         nginx 1.25.3
443/tcp  open    https        TLS 1.3 / AES-256-GCM
3000/tcp filtered node-dev    [firewall]
5432/tcp closed  postgresql
8080/tcp closed  http-proxy

OS Detection: Linux 5.x | Host is UP (0.002s latency)
SECURITY HEADERS FOUND:
  ✓ Strict-Transport-Security (HSTS)
  ✓ Content-Security-Policy (CSP)
  ✓ X-Frame-Options: DENY
  ✓ X-Content-Type-Options: nosniff
  ✗ Referrer-Policy: NOT SET (recomendado)

Nmap scan completed. 6 ports scanned in 0.87s

-> Superficie de ataque: REDUCIDA. Sin puertos críticos expuestos.`,
        });
        break;
      }

      case 'vuln-scan': {
        soundManager.playSuccess();
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `[🛡] AUDITORÍA OWASP TOP 10 // samuel-borda.portfolio
--------------------------------------------------
Analizando vectores de ataque conocidos...

  A01 Broken Access Control     → ✓ MITIGADO  (RBAC + Sanctum en todos los endpoints)
  A02 Cryptographic Failures    → ✓ MITIGADO  (TLS 1.3 | bcrypt cost=12 | AES-256)
  A03 Injection (SQL/XSS)       → ✓ MITIGADO  (ORM Eloquent | validación server-side)
  A04 Insecure Design           → ✓ MITIGADO  (Threat modeling aplicado en Ceta)
  A05 Security Misconfiguration → ⚠ REVISAR   (Referrer-Policy pendiente en prod)
  A06 Vulnerable Components     → ✓ MITIGADO  (Dependabot + npm audit activo)
  A07 Auth Failures             → ✓ MITIGADO  (Rate limiting | Token expiry corto)
  A08 Software & Data Integrity → ✓ MITIGADO  (GitHub Actions CI firmado)
  A09 Logging & Monitoring      → ⚠ PENDIENTE (Sin SIEM en entorno personal)
  A10 SSRF                      → ✓ MITIGADO  (Sin fetch externo sin whitelist)

RESUMEN: 8/10 controles implementados | Riesgo residual: BAJO

-> Use "owasp" para el detalle de referencia completo.`,
        });
        break;
      }

      case 'cipher': {
        const plaintext = argStr || 'samuel.borda@example.com';
        const fakeKey = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        const fakeCiphertext = Array.from({ length: 44 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        soundManager.playSuccess();
        newLogs.push({
          id: Date.now() + 1,
          type: 'success',
          text: `[🔐] AES-256-GCM ENCRYPT // MODO DEMOSTRATIVO
--------------------------------------------------
Plaintext   : "${plaintext}"
Algoritmo   : AES-256-GCM (Galois/Counter Mode — autenticado)
Derivación  : PBKDF2 + SHA-256 | 310,000 iteraciones
Salt        : ${fakeKey.slice(0, 16)} (random 128-bit)
Key (256-b) : ${fakeKey}
Ciphertext  : ${fakeCiphertext}==
Auth Tag    : ${fakeKey.slice(0, 8)} (GCM integrity tag)

✓ GCM garantiza confidencialidad + integridad en un solo paso.
✓ Sin clave correcta, descifrar requiere ~3.4×10^38 años.`,
        });
        break;
      }

      case 'owasp':
        newLogs.push({
          id: Date.now() + 1,
          type: 'output',
          text: `[📋] OWASP TOP 10 — 2021 REFERENCE
--------------------------------------------------
  A01  Broken Access Control      → Control de permisos inadecuado
  A02  Cryptographic Failures     → Datos sensibles sin cifrar en tránsito/reposo
  A03  Injection                  → SQL/XSS/Command injection por inputs sin sanitizar
  A04  Insecure Design            → Falta de threat modeling en el diseño
  A05  Security Misconfiguration  → Headers faltantes, debug activo en prod
  A06  Vulnerable & Outdated Deps → Dependencias con CVEs conocidos
  A07  Identification & Auth      → Brute force, sesiones sin expiración
  A08  Software Integrity Failure  → Pipeline CI/CD sin firmas
  A09  Logging & Monitoring Fail  → Sin alertas ante incidentes activos
  A10  SSRF                       → Requests hacia infra interna desde servidor

-> Fuente oficial: https://owasp.org/Top10/
-> Ejecuta "vuln-scan" para ver el estado de mitigación en este stack.`,
        });
        break;


      default:
        newLogs.push({
          id: Date.now() + 1,
          type: 'error',
          text: `Comando no reconocido: "${cmd}". Escribe "help" para ver los comandos disponibles.`,
        });
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputVal(history[newIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(newIndex);
        setInputVal(history[newIndex] || '');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#050608] border border-[#00f0ff]/60 shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col font-mono text-xs clip-cyber">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0c12] border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-[#fcee0a] font-bold">
            <Terminal className="w-4 h-4 text-[#00f0ff]" />
            <span className="tracking-wider">NETRUNNER_TERMINAL // CLI OPERATIVA</span>
            <span className="px-1.5 py-0.2 bg-cyan-950/60 text-[#00f0ff] border border-[#00f0ff]/30 text-[9px]">
              ONLINE
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick action pill toolbar */}
        <div className="px-4 py-2 bg-[#080a10] border-b border-slate-800/80 flex flex-wrap gap-2 text-[10px]">
          <span className="text-slate-500 self-center">Atajos:</span>
          {['help', 'projects', 'whoami', 'pentest', 'vuln-scan', 'owasp', 'cipher Samuel', 'planets', 'clear'].map((action) => (
            <button
              key={action}
              onClick={() => executeCommand(action)}
              className="px-2 py-0.5 bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-[#00f0ff] hover:border-[#00f0ff] transition-colors"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Terminal body */}
        <div className="p-4 h-96 overflow-y-auto space-y-2 text-slate-300 bg-[#040609]">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`whitespace-pre-wrap leading-relaxed font-mono ${
                log.type === 'input'
                  ? 'text-[#fcee0a] font-bold'
                  : log.type === 'system'
                  ? 'text-[#00f0ff]'
                  : log.type === 'success'
                  ? 'text-emerald-400 font-medium'
                  : log.type === 'error'
                  ? 'text-[#ff003c]'
                  : 'text-slate-300'
              }`}
            >
              {log.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCommand(inputVal);
          }}
          className="flex items-center gap-2 px-4 py-3 bg-[#020305] border-t border-slate-800"
        >
          <span className="text-[#00f0ff] font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#fcee0a]" />
            <span>samuel@netrunner:~$</span>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="escribe un comando ('help' para ver opciones)..."
            className="flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-600 text-xs font-mono"
          />
          <button
            type="submit"
            className="px-2 py-1 text-slate-400 hover:text-[#fcee0a] transition-colors border border-slate-800 hover:border-[#fcee0a]"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
