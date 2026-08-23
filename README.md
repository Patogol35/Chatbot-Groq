🤖 Chatbot con Inteligencia Artificial

Sasha es un chatbot de inteligencia artificial desarrollado para el portfolio personal de Jorge Patricio Santamaría Cherrez.

Está diseñado para responder preguntas sobre Jorge, sus estudios, certificaciones, tecnologías y proyectos, además de proporcionar respuestas sobre programación y tecnología en general.

El backend utiliza la API de Groq para generar las respuestas mediante un modelo de lenguaje.

---

⚙️ Tecnologías utilizadas

- Node.js

- Express

- JavaScript

- Groq API

- Groq SDK

- OpenAI GPT-OSS 20B

- CORS

- dotenv

---

✨ Funcionalidades

- Chat interactivo con inteligencia artificial

- Respuestas sobre el perfil profesional de Jorge

- Información sobre estudios y certificaciones

- Información sobre tecnologías y proyectos

- Respuestas generales sobre programación y tecnología

- Historial de conversación

- Control del tamaño de los mensajes

- Limitación del historial enviado al modelo

- Manejo de errores de la API

- Protección de información privada

- Control de solicitudes mediante respuestas ante límites de la API

- Respuestas optimizadas mediante un límite de tokens

- API REST para comunicación con el frontend

---

🧠 Inteligencia Artificial

El chatbot utiliza Groq como proveedor de inferencia y el modelo:

- openai/gpt-oss-20b

Sasha cuenta con un prompt de sistema diseñado para:

- Mantener una personalidad profesional y natural

- Responder de forma clara y breve

- Utilizar únicamente la información disponible sobre Jorge

- Evitar inventar información profesional

- Diferenciar estudios, certificaciones, conocimientos y proyectos

- Proteger información privada y credenciales

- Mantener el contexto de la conversación

- Responder preguntas generales sobre programación y tecnología

---

🔐 Seguridad y validaciones

El backend incorpora diferentes medidas para controlar las solicitudes:

- Validación de mensajes vacíos

- Límite máximo de 1500 caracteres por mensaje

- Límite de 12 mensajes en el historial

- Validación y limpieza del historial recibido

- Protección de la API Key mediante variables de entorno

- Protección de las instrucciones internas del chatbot

- No exposición de información privada

- Manejo de errores por límite de solicitudes

---

📦 Instalación y ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/Patogol35/groqbot
