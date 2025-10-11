$port = 3000
$connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connection) {
    $processId = $connection.OwningProcess | Select-Object -First 1
    Write-Host "Deteniendo proceso $processId en puerto $port..."
    Stop-Process -Id $processId -Force
    Write-Host "Proceso terminado exitosamente"
} else {
    Write-Host "No hay ning�n proceso usando el puerto $port"
}
