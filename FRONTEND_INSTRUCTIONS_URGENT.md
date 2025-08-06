# 🚨 INSTRUCCIONES URGENTES PARA FRONTEND - DEADLINE: MENOS DE 1 HORA
## Orden directo del CEO - Implementación inmediata requerida

### 📡 BACKEND YA OPERATIVO
- **URL Base**: `http://3.85.5.222:8001`
- **Estado**: ✅ FUNCIONANDO con OpenAI GPT-4o real
- **Última verificación**: Agosto 6, 2025 - 17:17 UTC

---

## ⚡ IMPLEMENTACIÓN FRONTEND INMEDIATA

### 1. 🔗 ENDPOINTS DISPONIBLES (LISTOS PARA USO)

#### Health Check
```bash
GET http://3.85.5.222:8001/api/health
```
**Respuesta esperada:**
```json
{
  "status": "healthy",
  "service": "AstroFlora OpenAI Working Backend",
  "version": "10.0.0-OPENAI",
  "system_type": "REAL_OPENAI_BACKEND"
}
```

#### Chat con Driver AI
```bash
POST http://3.85.5.222:8001/api/chat
Content-Type: application/json

{
  "message": "Tu pregunta aquí"
}
```

**Respuesta esperada:**
```json
{
  "response": "Respuesta del Driver AI...",
  "status": "success",
  "model_used": "gpt-4o",
  "tokens_used": 420,
  "timestamp": "2025-08-06T17:17:00"
}
```

---

## 🚀 CÓDIGO FRONTEND INMEDIATO

### React/Next.js Implementation
```jsx
// components/AstroFloraChat.jsx
import { useState, useEffect } from 'react';

const ASTROFLORA_API = 'http://3.85.5.222:8001';

export default function AstroFloraChat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(null);

  // Verificar estado del backend al cargar
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const res = await fetch(`${ASTROFLORA_API}/api/health`);
      const data = await res.json();
      setIsOnline(data.status === 'healthy');
    } catch (error) {
      setIsOnline(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${ASTROFLORA_API}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });
      
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse('Error conectando con AstroFlora: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="astroflora-chat">
      <div className="status-indicator">
        🤖 AstroFlora Driver AI: {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
      </div>
      
      <div className="chat-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Pregunta algo sobre bioinformática, proteínas, o análisis molecular..."
          rows={4}
          className="message-input"
        />
        
        <button 
          onClick={sendMessage} 
          disabled={loading || !isOnline}
          className="send-button"
        >
          {loading ? '🔄 Procesando...' : '🚀 Enviar a AstroFlora'}
        </button>
        
        {response && (
          <div className="response-container">
            <h3>🧬 Respuesta de AstroFlora:</h3>
            <div className="response-text">{response}</div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Vanilla JavaScript (Implementación más rápida)
**✅ ARCHIVO YA CREADO: `astroflora-frontend-demo.html`**

---

## ⚡ DEPLOY INMEDIATO (3 OPCIONES)

### Opción 1: Vercel (2 minutos)
```bash
npx create-next-app@latest astroflora-frontend
cd astroflora-frontend
# Copiar código React arriba
npm run build
npx vercel --prod
```

### Opción 2: GitHub Pages (5 minutos)
```bash
# Crear repo "astroflora-frontend"
# Subir el HTML de arriba como index.html
# Activar GitHub Pages
```

### Opción 3: Servidor directo (1 minuto)
```bash
# Guardar HTML como astroflora-demo.html
# Abrir en navegador
```

---

## 🧪 PRUEBAS OBLIGATORIAS (2 minutos)

### Test 1: Verificar conexión
- ✅ Status indicator debe mostrar "ONLINE"
- ✅ Version debe ser "10.0.0-OPENAI"

### Test 2: Chat básico
```
Input: "Hola AstroFlora"
Expected: Respuesta de presentación en español
```

### Test 3: Consulta científica
```
Input: "¿Qué es la proteína BRAF?"
Expected: Explicación científica detallada
```

---

## 🚨 CONTACTO DE EMERGENCIA
- **Backend Status**: http://3.85.5.222:8001/api/health
- **Test directo**: http://3.85.5.222:8001/docs (FastAPI docs)
- **Backend Engineer**: Disponible para soporte

---

## ✅ CHECKLIST FINAL
- [ ] Frontend desplegado y accesible
- [ ] Conexión con backend confirmada
- [ ] Chat funcionando con respuestas reales
- [ ] Demo listo para CEO en **< 1 HORA**

**🎯 DEADLINE CRÍTICO: MENOS DE 1 HORA**
**🚀 BACKEND YA ESTÁ LISTO - SOLO FALTA FRONTEND**
