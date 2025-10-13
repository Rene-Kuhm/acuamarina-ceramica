#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL del backend (CAMBIA ESTO por tu URL de Vercel)
BACKEND_URL="https://tu-backend.vercel.app"

echo "========================================="
echo "🧪 Testing Backend Deployment"
echo "========================================="
echo ""

# Test 1: Health Check Básico
echo -e "${YELLOW}Test 1: Health Check Básico${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health")
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✅ Health check passed (200)${NC}"
    curl -s "$BACKEND_URL/health" | jq '.'
else
    echo -e "${RED}❌ Health check failed ($response)${NC}"
fi
echo ""

# Test 2: Health Check Detallado
echo -e "${YELLOW}Test 2: Health Check Detallado${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health/detailed")
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✅ Detailed health check passed (200)${NC}"
    curl -s "$BACKEND_URL/health/detailed" | jq '.'
else
    echo -e "${RED}❌ Detailed health check failed ($response)${NC}"
fi
echo ""

# Test 3: API Info
echo -e "${YELLOW}Test 3: API Info${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/v1")
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✅ API info passed (200)${NC}"
    curl -s "$BACKEND_URL/api/v1" | jq '.'
else
    echo -e "${RED}❌ API info failed ($response)${NC}"
fi
echo ""

# Test 4: Get Categories
echo -e "${YELLOW}Test 4: Get Categories${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/v1/categories")
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✅ Categories endpoint passed (200)${NC}"
    curl -s "$BACKEND_URL/api/v1/categories" | jq '.data | length'
    echo " categories found"
else
    echo -e "${RED}❌ Categories endpoint failed ($response)${NC}"
    curl -s "$BACKEND_URL/api/v1/categories"
fi
echo ""

# Test 5: Get Products
echo -e "${YELLOW}Test 5: Get Products${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/v1/products")
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✅ Products endpoint passed (200)${NC}"
    curl -s "$BACKEND_URL/api/v1/products" | jq '.data | length'
    echo " products found"
else
    echo -e "${RED}❌ Products endpoint failed ($response)${NC}"
    curl -s "$BACKEND_URL/api/v1/products"
fi
echo ""

# Test 6: Swagger Docs
echo -e "${YELLOW}Test 6: Swagger Documentation${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api-docs")
if [ $response -eq 200 ] || [ $response -eq 301 ]; then
    echo -e "${GREEN}✅ Swagger docs available${NC}"
    echo "   Visit: $BACKEND_URL/api-docs"
else
    echo -e "${RED}❌ Swagger docs not available ($response)${NC}"
fi
echo ""

echo "========================================="
echo "✅ Testing Complete!"
echo "========================================="
echo ""
echo "📝 Next Steps:"
echo "   1. Check Vercel logs: vercel logs"
echo "   2. Visit Swagger: $BACKEND_URL/api-docs"
echo "   3. Test login endpoint with Postman/Insomnia"
echo ""
