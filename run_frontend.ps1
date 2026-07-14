# run_frontend.ps1
param()

$outFile = "$env:TEMP\frontend_out.txt"
$errFile = "$env:TEMP\frontend_err.txt"

# Kill old node
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { 
    taskkill /F /ID $_.Id 2>$null 
}
Start-Sleep 2

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "cmd"
$psi.Arguments = '/c "cd /d "C:\Users\dell\Documents\New OpenCode Project\frontend" && npm run dev"'
$psi.UseShellExecute = $true
$psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden

$p = [System.Diagnostics.Process]::Start($psi)
Write-Host "Started frontend PID: $($p.Id)"

Start-Sleep 15

# Poll to see if port opens
for ($i=0; $i -lt 30; $i++) {
    try {
        $r = [System.Net.WebRequest]::Create("http://127.0.0.1:3000/")
        $r.Timeout = 3000
        $response = $r.GetResponse()
        Write-Host "Frontend is UP after $($i*5) seconds: Status $($response.StatusCode)"
        $response.Close()
        break
    } catch {
        $type = $_.Exception.GetType().Name
        Write-Host "poll $i: $type"
        Start-Sleep 5
    }
}
