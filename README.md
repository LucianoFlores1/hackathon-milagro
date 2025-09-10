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

# Ejecuta el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la app.

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
