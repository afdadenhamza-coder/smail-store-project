# Kill old processes
Get-Process -Name python,node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 2

# Start backend in a new window capturing output
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "cmd"
$psi.Arguments = '/c "cd /d "C:\Users\dell\Documents\New OpenCode Project\backend" && uvicorn app.main:app --host 0.0.0.0 --port 8000 --log-level debug"'
$psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.CreateNoWindow = $true
$p = [System.Diagnostics.Process]::Start($psi)

Start-Sleep 10

# Test PUT
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8000/api/admin/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@smailstore.shop","password":"admin123"}' -UseBasicParsing -TimeoutSec 10
    $token = ($r.Content | ConvertFrom-Json).token
    Write-Host "Token: OK"

    $r2 = Invoke-WebRequest -Uri "http://localhost:8000/api/admin/products" -Headers @{Authorization="Bearer $token"} -UseBasicParsing -TimeoutSec 10
    $products = $r2.Content | ConvertFrom-Json
    $id = $products[0].id
    Write-Host "Products loaded. Editing $id"

    $body = '{
        "name":"TESt TSHIRT",
        "slug":"test-tshirt",
        "description":"Test desc",
        "price":199,
        "offer_price":149,
        "has_offer":true,
        "images":["/images/test.jpg"],
        "sizes":["S","M","L","XL"],
        "category":"t-shirts",
        "is_active":true,
        "is_featured":true,
        "is_upsell":false,
        "rating":5,
        "reviews_count":100
    }'

    Write-Host "Sending PUT..."
    try {
        $r3 = Invoke-WebRequest -Uri "http://localhost:8000/api/admin/products/$id" -Method PUT -Headers @{Authorization="Bearer $token"; "Content-Type"="application/json"} -Body $body -UseBasicParsing -TimeoutSec 10
        Write-Host "PUT Status: $($r3.StatusCode)"
        Write-Host "PUT Response: $($r3.Content)"
    } catch {
        Write-Host "PUT Error"
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            if ($stream) {
                $reader = New-Object System.IO.StreamReader($stream)
                $errBody = $reader.ReadToEnd()
                Write-Host "Error body: $errBody"
            }
        } else {
            Write-Host $_.Exception.Message
        }
    }

    # Now read stderr from the backend process
    Start-Sleep 3
    $stderr = $p.StandardError.ReadToEnd()
    if ($stderr) { Write-Host "STDERR: $stderr" }

} catch {
    Write-Host "Setup error: $_"
}
