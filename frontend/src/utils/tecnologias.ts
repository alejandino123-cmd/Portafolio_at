// Catálogo de tecnologías con sus íconos (paquete "devicon").
// Para agregar una: nombre, clase de ícono de https://devicon.dev (o null) y alias opcionales.

export interface Tecnologia {
  nombre: string
  icono: string | null
  alias?: string[]
}

export const CATALOGO: Tecnologia[] = [
  { nombre: "Vue 3", icono: "devicon-vuejs-plain colored", alias: ["vue","vue.js","vuejs","vue3"] },
  { nombre: "React", icono: "devicon-react-original colored", alias: ["reactjs","react.js"] },
  { nombre: "Angular", icono: "devicon-angular-plain colored", alias: ["angularjs"] },
  { nombre: "Svelte", icono: "devicon-svelte-plain colored" },
  { nombre: "Astro", icono: "devicon-astro-plain colored" },
  { nombre: "Next.js", icono: "devicon-nextjs-plain", alias: ["next"] },
  { nombre: "Nuxt", icono: "devicon-nuxtjs-plain colored", alias: ["nuxt"] },
  { nombre: "Vite", icono: "devicon-vitejs-plain colored", alias: ["vite"] },
  { nombre: "TypeScript", icono: "devicon-typescript-plain colored", alias: ["ts"] },
  { nombre: "JavaScript", icono: "devicon-javascript-plain colored", alias: ["js"] },
  { nombre: "HTML5", icono: "devicon-html5-plain colored", alias: ["html"] },
  { nombre: "CSS3", icono: "devicon-css3-plain colored", alias: ["css"] },
  { nombre: "Tailwind CSS", icono: "devicon-tailwindcss-original colored", alias: ["tailwind"] },
  { nombre: "Bootstrap", icono: "devicon-bootstrap-plain" },
  { nombre: "Sass", icono: "devicon-sass-original colored", alias: ["scss"] },
  { nombre: "Vuetify", icono: "devicon-vuetify-plain colored" },
  { nombre: "PrimeVue", icono: null },
  { nombre: "DaisyUI", icono: null, alias: ["daisy"] },
  { nombre: "Pinia", icono: null },
  { nombre: "Redux", icono: "devicon-redux-original colored" },
  { nombre: "jQuery", icono: "devicon-jquery-plain colored" },
  { nombre: "Alpine.js", icono: "devicon-alpinejs-original", alias: ["alpine"] },
  { nombre: "Webpack", icono: "devicon-webpack-plain colored" },
  { nombre: "Electron", icono: "devicon-electron-original colored" },
  { nombre: "Node.js", icono: "devicon-nodejs-plain colored", alias: ["node","nodejs"] },
  { nombre: "Express", icono: "devicon-express-original", alias: ["expressjs","express.js"] },
  { nombre: "NestJS", icono: "devicon-nestjs-original colored", alias: ["nest"] },
  { nombre: "Laravel", icono: "devicon-laravel-original colored" },
  { nombre: "Livewire", icono: "devicon-livewire-plain colored" },
  { nombre: "Sanctum", icono: null, alias: ["laravelsanctum"] },
  { nombre: "PHP", icono: "devicon-php-plain colored" },
  { nombre: "Python", icono: "devicon-python-plain colored" },
  { nombre: "Flask", icono: "devicon-flask-original" },
  { nombre: "Django", icono: "devicon-django-plain" },
  { nombre: "FastAPI", icono: "devicon-fastapi-plain colored" },
  { nombre: "Java", icono: "devicon-java-plain colored" },
  { nombre: "Spring Boot", icono: "devicon-spring-original colored", alias: ["spring"] },
  { nombre: "C#", icono: "devicon-csharp-plain", alias: ["csharp","c sharp"] },
  { nombre: ".NET", icono: "devicon-dotnetcore-plain", alias: ["dotnet","net"] },
  { nombre: "C", icono: "devicon-c-original colored" },
  { nombre: "C++", icono: "devicon-cplusplus-plain", alias: ["cpp"] },
  { nombre: "Go", icono: "devicon-go-plain colored", alias: ["golang"] },
  { nombre: "Rust", icono: "devicon-rust-original" },
  { nombre: "Ruby on Rails", icono: "devicon-rails-plain", alias: ["rails","ruby"] },
  { nombre: "GraphQL", icono: "devicon-graphql-plain colored" },
  { nombre: "Prisma", icono: "devicon-prisma-original" },
  { nombre: "Swagger", icono: "devicon-swagger-plain colored" },
  { nombre: "JWT", icono: "devicon-jwt-plain colored" },
  { nombre: "MongoDB", icono: "devicon-mongodb-plain colored", alias: ["mongo"] },
  { nombre: "Mongoose", icono: "devicon-mongoose-original" },
  { nombre: "PostgreSQL", icono: "devicon-postgresql-plain colored", alias: ["postgres"] },
  { nombre: "MySQL", icono: "devicon-mysql-original colored" },
  { nombre: "MariaDB", icono: "devicon-mariadb-original" },
  { nombre: "SQLite", icono: "devicon-sqlite-plain colored" },
  { nombre: "SQL Server", icono: "devicon-microsoftsqlserver-plain colored", alias: ["sqlserver","mssql"] },
  { nombre: "Oracle", icono: "devicon-oracle-original" },
  { nombre: "Redis", icono: "devicon-redis-plain colored" },
  { nombre: "Firebase", icono: "devicon-firebase-plain colored" },
  { nombre: "Supabase", icono: "devicon-supabase-plain colored" },
  { nombre: "Elasticsearch", icono: "devicon-elasticsearch-plain colored" },
  { nombre: "Flutter", icono: "devicon-flutter-plain colored" },
  { nombre: "Dart", icono: "devicon-dart-plain colored" },
  { nombre: "Kotlin", icono: "devicon-kotlin-plain" },
  { nombre: "Swift", icono: "devicon-swift-plain colored" },
  { nombre: "Android", icono: "devicon-android-plain colored" },
  { nombre: "Docker", icono: "devicon-docker-plain colored" },
  { nombre: "Kubernetes", icono: "devicon-kubernetes-plain colored", alias: ["k8s"] },
  { nombre: "Git", icono: "devicon-git-plain colored" },
  { nombre: "GitHub", icono: "devicon-github-original" },
  { nombre: "GitLab", icono: "devicon-gitlab-plain colored" },
  { nombre: "Linux", icono: "devicon-linux-plain" },
  { nombre: "Ubuntu", icono: "devicon-ubuntu-plain colored" },
  { nombre: "Nginx", icono: "devicon-nginx-original colored" },
  { nombre: "Apache", icono: "devicon-apache-plain" },
  { nombre: "XAMPP", icono: null },
  { nombre: "Postman", icono: "devicon-postman-plain colored" },
  { nombre: "Figma", icono: "devicon-figma-plain colored" },
  { nombre: "VS Code", icono: "devicon-vscode-plain colored", alias: ["visualstudiocode"] },
  { nombre: "npm", icono: "devicon-npm-plain colored" },
  { nombre: "Netlify", icono: "devicon-netlify-plain colored" },
  { nombre: "Vercel", icono: "devicon-vercel-original" },
  { nombre: "AWS", icono: "devicon-amazonwebservices-plain colored", alias: ["amazonwebservices"] },
  { nombre: "Azure", icono: "devicon-azure-plain colored" },
  { nombre: "Google Cloud", icono: "devicon-googlecloud-plain colored", alias: ["gcp"] },
  { nombre: "Heroku", icono: "devicon-heroku-plain colored" },
  { nombre: "Jest", icono: "devicon-jest-plain colored" },
  { nombre: "Vitest", icono: "devicon-vitest-plain colored" },
  { nombre: "Cypress", icono: "devicon-cypressio-plain", alias: ["cypress"] },
  { nombre: "Selenium", icono: "devicon-selenium-original" },
  { nombre: "Jira", icono: "devicon-jira-plain colored" },
  { nombre: "Trello", icono: "devicon-trello-plain" },
  { nombre: "Notion", icono: "devicon-notion-plain colored" },
  { nombre: "WordPress", icono: "devicon-wordpress-plain" },
  { nombre: "TensorFlow", icono: "devicon-tensorflow-original colored" },
  { nombre: "PyTorch", icono: "devicon-pytorch-original colored" },
  { nombre: "Pandas", icono: "devicon-pandas-plain" },
  { nombre: "NumPy", icono: "devicon-numpy-plain colored" },
  { nombre: "Jupyter", icono: "devicon-jupyter-plain colored" },
  { nombre: "OpenCV", icono: "devicon-opencv-plain colored" },
  { nombre: "Arduino", icono: "devicon-arduino-plain colored" },
  { nombre: "Raspberry Pi", icono: "devicon-raspberrypi-plain", alias: ["raspberry"] },
  { nombre: "Unity", icono: "devicon-unity-plain colored" },
]

// "Vue 3", "vue.js" y "VUE" se tratan igual; también ignora tildes, espacios y puntos
export const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9#+]/g, '')

const porClave = new Map<string, Tecnologia>()
for (const t of CATALOGO) {
  for (const n of [t.nombre, ...(t.alias ?? [])]) porClave.set(normalizar(n), t)
}

/** Devuelve la tecnología del catálogo que corresponde a un nombre guardado (o undefined). */
export function buscarTecnologia(nombre: string): Tecnologia | undefined {
  return porClave.get(normalizar(nombre))
}

export interface Opcion {
  nombre: string
  icono: string | null
  personalizada?: boolean
}

/**
 * Opciones para el buscador: coincidencias del catálogo (sin las ya elegidas),
 * ordenadas por relevancia, y al final "agregar" lo escrito si no existe.
 */
export function sugerir(consulta: string, elegidas: string[], max = 8): Opcion[] {
  const q = normalizar(consulta)
  const usadas = new Set(elegidas.map(e => buscarTecnologia(e)?.nombre ?? normalizar(e)))
  const libres = CATALOGO.filter(t => !usadas.has(t.nombre))

  if (!q) return libres.map(t => ({ nombre: t.nombre, icono: t.icono }))

  const puntuar = (t: Tecnologia) => {
    const claves = [t.nombre, ...(t.alias ?? [])].map(normalizar)
    if (claves.some(k => k === q)) return 0
    if (claves.some(k => k.startsWith(q))) return 1
    if (claves.some(k => k.includes(q))) return 2
    return -1
  }

  const lista = libres
    .map(t => ({ t, p: puntuar(t) }))
    .filter(x => x.p >= 0)
    .sort((a, b) => a.p - b.p)
    .slice(0, max)
    .map(x => ({ nombre: x.t.nombre, icono: x.t.icono }) as Opcion)

  const yaExiste =
    porClave.has(q) || elegidas.some(e => normalizar(e) === q)
  if (!yaExiste) lista.push({ nombre: consulta.trim(), icono: null, personalizada: true })
  return lista
}