# 🌊 Margarita AI 🏝️

[![positivo para vibecoding](https://img.shields.io/badge/vibecoding-positivo-teal?style=for-the-badge&logo=google-gemini&logoColor=white)](https://github.com)

> Un experimento personal que combina el análisis cuantitativo de las Ciencias Actuariales con la pasión por el desarrollo de software y la programación.

---

## 👨‍💻 Sobre el Proyecto

Este proyecto nació como un espacio de experimentación y *vibecoding* desarrollado desde Venezuela. Como estudiante de Ciencias Actuariales en la Universidad Central de Venezuela (UCV), suelo explorar cómo la lógica analítica y la programación convergen en herramientas prácticas. 

**Margarita AI** es el resultado de eso: un asistente turístico inteligente para la Isla de Margarita que no solo ofrece recomendaciones basadas en presupuestos y ubicación GPS, sino que implementa una arquitectura resiliente con un sistema de respaldo automático de modelos de IA para evitar interrupciones por límites de frecuencia (`429`).

---

## ✨ Características Principales

* **💧 Interfaz Aguamarina Immersiva:** Diseño moderno estilo *Liquid Glass* con tonos turquesas, cian y efectos de brillo neón.
* **🔄 Sistema de Respaldo Automático (Fallback):** Control inteligente de la API. Si el modelo principal experimenta alta demanda, el sistema realiza un *swap* transparente a modelos de respaldo (`gemini-3.5-flash` ➡️ `gemini-3.6-flash`).
* **💬 Conversación Fluida y Directa:** Respuestas optimizadas para simular una charla natural, eliminando bloques de texto masivos y formatos complejos.
* **🗺️ Datos Locales:** Integración de datasets propios sobre playas, restaurantes y actividades turísticas de la isla.

---

## 🛠️ Tecnologías Utilizadas

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Inteligencia Artificial:** [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini SDK)
* **Animaciones:** [Anime.js](https://animejs.com/)r Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
