# 🐶🐱 Hackathon del Milagro – "Amigo Fiel"

Plataforma colaborativa para publicar y encontrar mascotas perdidas durante la Procesión del Milagro en Salta. 
Permite crear avisos, compartirlos, reportar publicaciones y coordinar encuentros.

La app busca conectar rápidamente a quienes perdieron o encontraron una mascota, de forma simple, segura y accesible.
---

**🚀 Demo pública**

👉 [Demo en producción](https://hackathon-milagro.vercel.app/)

---

⚙️ **Stack utilizado:**

-   Next.js 14 (Frontend, Routing, Server Actions)
-   Supabase (Base de datos y almacenamiento de imágenes)
-   Tailwind CSS + shadcn/ui (UI + estilos)
-   TypeScript
-   Lucide Icons
-   Vercel (Deploy)
-   IA: Asistencia de GitHub Copilot y ChatGPT en generación de código y documentación

---

🤖 **Créditos / Uso de IA**
- Asistencia en generación de código, documentación y debugging: ChatGPT (OpenAI), Gemini (Google) Copilot (GitHub).
- Inspiración visual: componentes de shadcn/ui
- Basado en boilerplates de Next.js.

---
📦 Funcionalidades principales

- ✅  Publicar aviso de animal perdido/encontrado con foto, especie, descripción, zona y contacto.
- ✅  Buscar y filtrar pore specie y estado.
- ✅ Marcar caso como Resuelto (oculta datos de contacto).
- ✅  Botón Reportar con captcha y auto-ocultar tras varios reportes.
- ✅  Botón Compartir (Web Share API / copiar link).
- ✅  Disclaimer de seguridad y privacidad integrado.
- ✅  Mobile-first, accesible y con imágenes optimizadas. 


---
🔒 Privacidad & Seguridad
👉[Politicas de privacidad](https://hackathon-milagro.vercel.app/privacidad)
- No se deben publicar domicilios exactos ni datos sensibles.
- Fotos permitidas: solo propias o con consentimiento.
- Recomendación de coordinar encuentros en lugares públicos y seguros.

---
♿ Accesibilidad
- Texto legible y alto contraste.
- Navegación simple y clara en dispositivos móviles.

---

📜 Licencia

Este proyecto se publica bajo licencia Apache 2.0 .
Ver [archivo LICENSE](https://github.com/LucianoFlores1/hackathon-milagro/blob/main/LICENSE)
 para más detalles.

🛠️ **Cómo correrlo localmente:**

```bash
# Clona el repositorio
https://github.com/LucianoFlores1/hackathon-milagro.git

# Entrar a la carpeta
cd hackathon-milagro

# Instala las dependencias
npm install

# Crear archivo .env.local con tus variables (ejemplo: Supabase URL y KEY)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# Configura la base de datos en Supabase:

create table posts (
  id uuid primary key default gen_random_uuid(),
  status text default ''::text,
  species text default ''::text,
  title text,
  description text,
  zone_text text,
  contact_type text,
  contact_value text,
  event_date date default current_date,
  created_at timestamptz default now(),
  resolved bool default false,
  image_url text,
  edit_token text,
  reports_count int4 default 0,
  contact_hidden bool default false
);

# 📂 Crea la tabla 'post' con la siguiente estructura:

# - id (uuid, PK, autogen)

# - status (text: "lost" o "found")

# - species (text: "dog", "cat", etc.)

# - title (text)

# - description (text)

# - zone_text (text, zona aproximada)

# - contact_type (text: "email" / "phone")

# - contact_value (text)

# - event_date (date, default: CURRENT_DATE)

# - created_at (timestamptz, default: now())

# - resolved (bool, default: false)

# - image_url (text, link a Supabase Storage)

# - edit_token (text, generado al crear el post, guardado en cookie local para edición posterior)

# - reports_count (int, default: 0)

# - contact_hidden (bool, default: false)

# 5. Activar RLS y crear políticas
-- Activar Row Level Security
alter table posts enable row level security;

-- Políticas actuales
create policy "Public can read posts" 
  on posts for select 
  using (true);

create policy "Public can insert specific fields" 
  on posts for insert
  with check ((status = ANY (ARRAY['lost','found'])) AND (species = ANY (ARRAY['dog','cat'])));

create policy "Allow public read" 
  on posts for select 
  using (true);

create policy "Allow public insert" 
  on posts for insert 
  with check (true);

create policy "Allow update if edit_token matches"
  on posts for update
  using (true)
  with check (edit_token = edit_token);

create policy "Allow update reports"
  on posts for update
  using (true)
  with check (true);


# Ejecuta el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la app.

---

---
🔐 Políticas activas (RLS)
| Policy name                             | Acción | Descripción                                                                                            |
| --------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| **Public can read posts**               | SELECT | Permite a cualquier usuario leer todos los posts.                                                      |
| **Allow public read**                   | SELECT | (Duplicada) También permite lectura pública sin restricciones.                                         |
| **Public can insert specific fields**   | INSERT | Permite a cualquier usuario crear posts **solo si** `status ∈ {lost, found}` y `species ∈ {dog, cat}`. |
| **Allow public insert**                 | INSERT | (Duplicada) Permite inserción pública sin restricciones.                                               |
| **Allow update if edit\_token matches** | UPDATE | Permite actualizar un post únicamente si coincide el `edit_token`.                                     |
| **Allow update reports**                | UPDATE | Permite incrementar `reports_count` en los posts (usado para botón "Reportar").                        |

---
📦 **Arquitectura Simple:**

-   Frontend: Next.js + Tailwind CSS
-   Backend: Supabase (base de datos y almacenamiento)
-   Deploy: Vercel
-   Auth mínima: tokens de edición mediante cookies
-   Sin cookies de seguimiento, solo localStorage para avisos y privacidad


---

🎥 **Pitch:** []

---


¡Gracias por visitar Amigo Fiel! 🐾
