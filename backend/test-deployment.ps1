# PowerShell Script para testing del deployment

param(
    [string]$BackendUrl = "https://tu-backend.vercel.app"
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🧪 Testing Backend Deployment" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Backend URL: $BackendUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check Básico
Write-Host "Test 1: Health Check Básico" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/health" -Method Get -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check passed (200)" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
    }
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Health Check Detallado
Write-Host "Test 2: Health Check Detallado" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/health/detailed" -Method Get -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Detailed health check passed (200)" -ForegroundColor Green
        $json = $response.Content | ConvertFrom-Json
        Write-Host "Status: $($json.status)" -ForegroundColor Green
        Write-Host "Database: $($json.database)" -ForegroundColor Green
        Write-Host "Uptime: $($json.uptime)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Detailed health check failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: API Info
Write-Host "Test 3: API Info" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/api/v1" -Method Get -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API info passed (200)" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
    }
} catch {
    Write-Host "❌ API info failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get Categories
Write-Host "Test 4: Get Categories" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/api/v1/categories" -Method Get -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $json = $response.Content | ConvertFrom-Json
        $count = $json.data.Count
        Write-Host "✅ Categories endpoint passed (200)" -ForegroundColor Green
        Write-Host "Found $count categories" -ForegroundColor Green
        $json.data | ForEach-Object { Write-Host "   - $($_.name)" -ForegroundColor Cyan }
    }
} catch {
    Write-Host "❌ Categories endpoint failed: $_" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode -ForegroundColor Red
}
Write-Host ""

# Test 5: Get Products
Write-Host "Test 5: Get Products" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/api/v1/products" -Method Get -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $json = $response.Content | ConvertFrom-Json
        $count = $json.data.Count
        Write-Host "✅ Products endpoint passed (200)" -ForegroundColor Green
        Write-Host "Found $count products" -ForegroundColor Green
        $json.data | Select-Object -First 3 | ForEach-Object {
            Write-Host "   - $($_.name) - `$$($_.price)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "❌ Products endpoint failed: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Swagger Docs
Write-Host "Test 6: Swagger Documentation" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BackendUrl/api-docs" -Method Get -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Swagger docs available" -ForegroundColor Green
        Write-Host "   Visit: $BackendUrl/api-docs" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  Swagger docs check: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
}
Write-Host ""

# Test 7: Login Endpoint (Should require credentials)
Write-Host "Test 7: Login Endpoint" -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@aguamarina.com"
        password = "admin123"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$BackendUrl/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $json = $response.Content | ConvertFrom-Json
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "   Token received: $($json.data.token.Substring(0, 20))..." -ForegroundColor Green
        Write-Host "   User: $($json.data.user.name) ($($json.data.user.email))" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Testing Complete!" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Check Vercel logs: vercel logs" -ForegroundColor White
Write-Host "   2. Visit Swagger: $BackendUrl/api-docs" -ForegroundColor White
Write-Host "   3. Update frontend with this URL" -ForegroundColor White
Write-Host ""
