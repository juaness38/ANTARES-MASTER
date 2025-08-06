#!/bin/bash

echo "🚀 === DIAGNÓSTICO COMPLETO ANTARES CHAT === 🚀"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo -e "${BLUE}1. 🔍 Verificando conectividad del backend...${NC}"
echo ""

# Test 1: Health check
echo "📡 Probando endpoint /api/health..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" -X GET "http://3.85.5.222:8001/api/health" -H "Content-Type: application/json")
HTTP_CODE="${HEALTH_RESPONSE: -3}"

if [ "$HTTP_CODE" = "200" ]; then
    show_result 0 "Backend health check"
    echo "Response: ${HEALTH_RESPONSE%???}"
else
    show_result 1 "Backend health check (HTTP $HTTP_CODE)"
fi

echo ""

# Test 2: Chat endpoint
echo "💬 Probando endpoint /api/chat..."
CHAT_RESPONSE=$(curl -s -w "%{http_code}" -X POST "http://3.85.5.222:8001/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Test de conectividad", "session_id": "bash_test"}')
CHAT_HTTP_CODE="${CHAT_RESPONSE: -3}"

if [ "$CHAT_HTTP_CODE" = "200" ]; then
    show_result 0 "Backend chat endpoint"
    echo "Response length: $(echo "${CHAT_RESPONSE%???}" | wc -c) characters"
else
    show_result 1 "Backend chat endpoint (HTTP $CHAT_HTTP_CODE)"
fi

echo ""

# Test 3: Frontend running
echo -e "${BLUE}2. 🌐 Verificando frontend...${NC}"
echo ""

echo "🔍 Verificando puertos activos..."
if lsof -i :3000 > /dev/null 2>&1; then
    show_result 0 "Puerto 3000 activo"
else
    show_result 1 "Puerto 3000 inactivo"
fi

if lsof -i :3001 > /dev/null 2>&1; then
    show_result 0 "Puerto 3001 activo"
else
    show_result 1 "Puerto 3001 inactivo"
fi

echo ""

# Test 4: Archivos de servicios
echo -e "${BLUE}3. 📁 Verificando archivos de servicios...${NC}"
echo ""

if [ -f "src/services/api.js" ]; then
    show_result 0 "API service existe"
    echo "    Tamaño: $(wc -c < src/services/api.js) bytes"
else
    show_result 1 "API service no encontrado"
fi

if [ -f "src/services/chatService.js" ]; then
    show_result 0 "Chat service existe"
    echo "    Tamaño: $(wc -c < src/services/chatService.js) bytes"
else
    show_result 1 "Chat service no encontrado"
fi

echo ""

# Test 5: Componentes actualizados
echo -e "${BLUE}4. ⚛️ Verificando componentes de chat...${NC}"
echo ""

if [ -f "components/chat/EliteAstroFloraChat.tsx" ]; then
    if grep -q "chatService" "components/chat/EliteAstroFloraChat.tsx"; then
        show_result 0 "EliteAstroFloraChat actualizado con nueva arquitectura"
    else
        show_result 1 "EliteAstroFloraChat NO actualizado"
    fi
else
    show_result 1 "EliteAstroFloraChat no encontrado"
fi

if [ -f "components/chat/SimpleChatInterface.tsx" ]; then
    if grep -q "chatService" "components/chat/SimpleChatInterface.tsx"; then
        show_result 0 "SimpleChatInterface actualizado con nueva arquitectura"
    else
        show_result 1 "SimpleChatInterface NO actualizado"
    fi
else
    show_result 1 "SimpleChatInterface no encontrado"
fi

if [ -f "components/chat/TestChatDirect.tsx" ]; then
    show_result 0 "Componente de test directo disponible"
else
    show_result 1 "Componente de test directo no encontrado"
fi

echo ""

# Test 6: Git status
echo -e "${BLUE}5. 📋 Estado del repositorio...${NC}"
echo ""

CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Branch actual: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" = "antares-dev-8.0" ]; then
    show_result 0 "En branch correcto (antares-dev-8.0)"
else
    show_result 1 "Branch incorrecto (esperado: antares-dev-8.0)"
fi

GIT_STATUS=$(git status --porcelain)
if [ -z "$GIT_STATUS" ]; then
    show_result 0 "Working tree limpio"
else
    show_result 1 "Hay cambios sin commit"
fi

echo ""

# Resumen final
echo -e "${YELLOW}📊 === RESUMEN === 📊${NC}"
echo ""
echo "🎯 PASOS PARA PROBAR EL CHAT:"
echo "1. Abrir: http://localhost:3001"
echo "2. Ir a la sección de chat"
echo "3. Enviar mensaje de prueba"
echo "4. O probar: http://localhost:3001/test"
echo ""
echo "🔧 ENDPOINTS DEL BACKEND:"
echo "• Health: http://3.85.5.222:8001/api/health"
echo "• Chat: http://3.85.5.222:8001/api/chat"
echo "• Analyze: http://3.85.5.222:8001/api/analyze"
echo ""
echo "📁 ARCHIVOS CLAVE ACTUALIZADOS:"
echo "• src/services/api.js - Conexión con backend"
echo "• src/services/chatService.js - Lógica de chat"
echo "• components/chat/* - Interfaces de usuario"
echo ""

if [ "$HTTP_CODE" = "200" ] && [ "$CHAT_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}🎉 ¡BACKEND FUNCIONANDO CORRECTAMENTE!${NC}"
    echo -e "${GREEN}El chat debería funcionar ahora con respuestas reales.${NC}"
else
    echo -e "${RED}⚠️ Problemas detectados en el backend.${NC}"
    echo -e "${RED}Verifica la conectividad y configuración.${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Diagnóstico completado.${NC}"
