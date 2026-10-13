/**
 * Script de Sincronización Local para Repositorios de GitHub
 * Uso: node scripts/sync-repos.mjs <tu-usuario-github>
 * 
 * Este script consulta la API pública de GitHub para traer la lista de tus repositorios,
 * sus estrellas, descripciones y lenguajes para que puedas elegir cuáles incluir en tu portafolio.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const username = process.argv[2] || process.env.GITHUB_USER;

if (!username) {
  console.log('\n❌ Debes especificar tu usuario de GitHub.');
  console.log('👉 Ejemplo de uso: npm run sync-repos tu-usuario-github\n');
  process.exit(1);
}

console.log(`\n🔍 Buscando repositorios para: @${username}...`);

const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

const options = {
  headers: {
    'User-Agent': 'Portfolio-Sync-Script',
    Accept: 'application/vnd.github.v3+json',
  },
};

https.get(url, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const repos = JSON.parse(data);

      if (!Array.isArray(repos)) {
        console.error('❌ Error al obtener datos de GitHub:', repos.message || repos);
        return;
      }

      console.log(`\n✅ ¡Se encontraron ${repos.length} repositorios públicos!\n`);
      console.log('---------------------------------------------------------');
      
      const mapped = repos
        .filter((r) => !r.fork) // Excluir forks si se desea
        .map((r, idx) => ({
          id: `repo-${idx + 1}`,
          title: r.name,
          description: r.description || 'Sin descripción',
          category: r.language || 'Fullstack',
          tags: [r.language || 'Code', ...(r.topics || [])].filter(Boolean),
          githubUrl: r.html_url,
          demoUrl: r.homepage || '',
          featured: r.stargazers_count > 0,
          stats: {
            stars: r.stargazers_count,
            forks: r.forks_count,
            language: r.language,
            lastUpdated: r.updated_at.split('T')[0],
          },
          difficulty: 'MEDIUM',
          rewardXP: 500,
        }));

      mapped.slice(0, 15).forEach((repo) => {
        console.log(`📦 [${repo.title}] | ⭐ ${repo.stats.stars} | 🛠️ ${repo.stats.language || 'N/A'}`);
        console.log(`   URL: ${repo.githubUrl}`);
        console.log(`   Desc: ${repo.description}\n`);
      });

      const outputPath = path.resolve(__dirname, '../src/data/github-repos-cache.json');
      fs.writeFileSync(outputPath, JSON.stringify(mapped, null, 2), 'utf-8');

      console.log(`💾 Repositorios guardados en: src/data/github-repos-cache.json`);
      console.log(`💡 Puedes copiar los que desees a src/data/projects.ts para que aparezcan en tu portafolio.\n`);
    } catch (err) {
      console.error('❌ Error al procesar respuesta:', err.message);
    }
  });
}).on('error', (err) => {
  console.error('❌ Error de conexión:', err.message);
});

