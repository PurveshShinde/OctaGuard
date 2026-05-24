$path = 'D:\OCTANE CyberSafe\OctaGuard\frontend\src\pages\Dashboard.jsx'
$content = Get-Content -Path $path -Raw
$content = $content.Replace('\`', '`').Replace('\${', '${')
Set-Content -Path $path -Value $content -Encoding UTF8
