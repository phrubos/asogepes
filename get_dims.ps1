Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('c:\Projects\asogepes_webapp_2\public\images\kutatás_pics\Szentkirály\erno_termal_0307.jpeg')
Write-Output "WIDTH:$($img.Width)"
Write-Output "HEIGHT:$($img.Height)"
$img.Dispose()
