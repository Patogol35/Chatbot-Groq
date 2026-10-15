🤖 Chatbot con Inteligencia Artificial

Sasha es un chatbot de inteligencia artificial desarrollado para el portfolio personal de Jorge Patricio Santamaría Cherrez.

Está diseñado para responder preguntas sobre el perfil profesional de Jorge, incluyendo sus estudios, certificaciones, tecnologías y proyectos, además de responder preguntas generales sobre diversos temas.

El backend está desarrollado con Node.js y Express, e integra la API de Groq para generar respuestas mediante un modelo de lenguaje. También incorpora un sistema de respuestas locales para atender determinadas consultas sin recurrir al modelo de inteligencia artificial.

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

Importante: Reemplaza tu_api_key por tu clave de API obtenida en la plataforma de Groq. No compartas ni publiques tu archivo .env o tu clave de API en GitHub.

5. Ejecutar el servidor (para desarrollo):

```bash

npm run dev

```

El backend estará disponible en:

http://localhost:3001

---

🔌 API

Endpoint principal:

"POST /api/chat"

Ejemplo 1: Pregunta sobre Jorge

Solicitud:

{
  "message": "¿Qué tecnologías utiliza Jorge?",
  "history": []
}

Respuesta:

{
  "response": "Jorge trabaja con tecnologías como React, JavaScript, Django, Java, PostgreSQL y MySQL.",
  "usage": {
    "promptTokens": 250,
    "completionTokens": 45,
    "totalTokens": 295,
    "estimatedCost": 0.000059
  }
}

Ejemplo 2: Pregunta general

Solicitud:

{
  "message": "¿Qué es la inteligencia artificial?",
  "history": []
}

Respuesta:

{
  "response": "La inteligencia artificial es una rama de la informática que permite a las máquinas realizar tareas que normalmente requieren capacidades humanas, como aprender, razonar y comprender el lenguaje.",
  "usage": {
    "promptTokens": 220,
    "completionTokens": 42,
    "totalTokens": 262,
    "estimatedCost": 0.0000524
  }
}

Nota: los valores de tokens y costo son ilustrativos. "promptTokens" representa los tokens de entrada, "completionTokens" los de salida, "totalTokens" el total utilizado y "estimatedCost" el costo estimado según la tarifa configurada en el backend. Las respuestas locales devuelven estos valores en cero.

---

🖥 Funcionamiento

1. El usuario escribe un mensaje en el chatbot.
2. El frontend envía la solicitud al endpoint "/api/chat".
3. El backend valida el mensaje recibido y comprueba su longitud.
4. Se procesan y validan los mensajes del historial de conversación.
5. El sistema comprueba si existe una respuesta local configurada para el mensaje.
6. Si no existe una respuesta local, se determina el contexto y se envía la solicitud al modelo de inteligencia artificial mediante Groq.
7. Sasha genera una respuesta utilizando las instrucciones y el contexto disponibles.
8. El backend devuelve la respuesta al frontend y registra el uso de tokens cuando corresponde.

---

🌐 Despliegue

El backend puede desplegarse en plataformas como Render, que permite publicar el servicio y obtener una URL accesible desde internet.

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

Configura la siguiente variable de entorno en el panel de Render:

- Key: GROQ_API_KEY

- Value: Tu clave de API de Groq

La clave de API de Groq es necesaria para generar respuestas mediante inteligencia artificial.

---

👨‍💻 Autor
Jorge Patricio Santamaría Cherrez

Máster en Ingeniería de Software y Sistemas Informáticos
