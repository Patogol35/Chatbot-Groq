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
Ingresa a la carpeta del proyecto:

```

2. Ingresa a la carpeta del proyecto:

```bash

cd groqbot

```

3. Instala las dependencias:

```bash

npm install

```

4. Crea un archivo .env en la raíz del proyecto:

```bash

GROQ_API_KEY=tu_api_key
PORT=3001

```

Ejecuta el servidor en modo desarrollo:

```bash
npm run dev

```

Para ejecutar el servidor:

```bash

npm run dev

```

El backend estará disponible en:

http://localhost:3001

---

🔌 API

Endpoint principal:

POST /api/chat

Ejemplo de solicitud:
{
  "message": "¿Qué tecnologías utiliza Jorge?",
  "history": []
}

Ejemplo de respuesta:

{
  "response": "Jorge trabaja con tecnologías como React, JavaScript, Python, Django, Java, PostgreSQL y MySQL."
  
}

---

🖥 Funcionamiento

- El usuario escribe un mensaje en el chatbot.

-;El frontend envía la solicitud al endpoint /api/chat.

- El backend valida y limpia el mensaje recibido.

- Se procesa el historial de conversación.

- Se envía la información al modelo de inteligencia artificial mediante Groq.

- Sasha genera una respuesta utilizando el contexto y las instrucciones configuradas.

- El backend devuelve la respuesta al frontend.

---

🌐 Despliegue

El backend puede desplegarse fácilmente en servicios como Render.

Configuración en Render:

- Build Command: "npm install"
- Start Command: "npm start"

🔑 Variable de entorno requerida

En Render, agrega la siguiente variable de entorno:

- Key: "GROQ_API_KEY"
- Value: Tu clave de API de Groq

---

👨‍💻 Autor
Jorge Patricio Santamaría Cherrez
Máster en Ingeniería de Software y Sistemas Informáticos
