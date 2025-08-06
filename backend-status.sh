# Script para verificar el estado del backend
echo "=== BACKEND STATUS CHECK ==="

# Verificar si hay procesos de Docker corriendo
echo "Checking Docker processes..."
if command -v docker &> /dev/null; then
    docker ps -a | grep -E "(astroflora|mcp|backend)" || echo "No AstroFlora containers found"
else
    echo "Docker not available in this environment"
fi

echo ""

# Verificar puertos en uso en la IP del backend
echo "Checking open ports on backend server..."
nmap -p 8000-8090 3.85.5.222 2>/dev/null || echo "nmap not available"

echo ""

# Crear URL de prueba temporal
echo "Suggested API Gateway URL configurations:"
echo "1. If backend runs on port 8080: http://3.85.5.222:8080/{proxy}"
echo "2. If backend runs on port 8001: http://3.85.5.222:8001/{proxy}"
echo "3. If backend runs on port 3000: http://3.85.5.222:3000/{proxy}"

echo ""
echo "Current API Gateway config shows: https://greenmoon.com.mx/api/{proxy}"
echo "This needs to be changed to point to your actual backend server."
