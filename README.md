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

- OpenAI GPT-OSS 120B

- CORS

- dotenv

---

✨ Funcionalidades

- Chat interactivo con inteligencia artificial.
- Respuestas sobre el perfil profesional y los proyectos de Jorge.
- Respuestas a preguntas generales y consultas sobre tecnología.
- Gestión del historial de conversación para mantener el contexto.
- Manejo de errores y límites de solicitudes de la API.
- Medidas para proteger información privada y credenciales.
- Optimización de respuestas mediante límites de tokens.
- API REST para la comunicación entre el frontend y el backend.

---

🧠 Inteligencia Artificial

El chatbot utiliza Groq como proveedor de inferencia y el modelo "openai/gpt-oss-120b".

Sasha cuenta con un prompt de sistema diseñado para:

- Mantener una personalidad profesional y natural.
- Responder de forma clara y breve.
- Proporcionar información sobre Jorge y su portfolio.
- Responder preguntas generales y consultas sobre tecnología.
- Evitar inventar información profesional.
- Proteger información privada y credenciales.
- Mantener el contexto de la conversación.

---

🔒 Seguridad y validaciones

El backend incorpora diferentes medidas para controlar las solicitudes y proteger la aplicación:

- Validación de mensajes vacíos.
- Límite máximo de 1000 caracteres por mensaje.
- Límite de 4 mensajes en el historial de conversación.
- Validación y limpieza del historial recibido.
- Protección de la API Key mediante variables de entorno.
- Instrucciones internas del chatbot gestionadas desde el backend.
- Restricción de la información profesional a los datos disponibles y verificados.
- Manejo de errores y respuestas ante límites de solicitudes de la API.

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

Importante: no publiques tu archivo .env ni tu clave de API en GitHub.

Ejecutar el servidor (para desarrollo):

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

- El frontend envía la solicitud al endpoint /api/chat.

- El backend valida y limpia el mensaje recibido.

- Se procesa el historial de conversación.

- Se envía la información al modelo de inteligencia artificial mediante Groq.

- Sasha genera una respuesta utilizando el contexto y las instrucciones configuradas.

- El backend devuelve la respuesta al frontend.

---

🌐 Despliegue

El backend puede desplegarse fácilmente en servicios como Render.

Configuración en Render:

- Build Command:
  
```bash

npm install

```

- Start Command:

```bash

npm start

```

🔑 Variable de entorno requerida

En Render, agrega la siguiente variable de entorno:

- Key: GROQ_API_KEY

- Value: Tu clave de API de Groq

---

👨‍💻 Autor
Jorge Patricio Santamaría Cherrez
Máster en Ingeniería de Software y Sistemas Informáticos
