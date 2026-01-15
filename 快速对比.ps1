# FindMissingXmind.ps1

# 设置要扫描的根目录（请根据实际情况修改）
$RootPath = "C:\Users\Administrator\Desktop\思维导图"


# 获取所有 .km 和 .xmind 的基础文件名（转小写，去重）
$kmFiles = Get-ChildItem -Path $RootPath -Recurse -Include "*.km" -ErrorAction SilentlyContinue |
    ForEach-Object { [System.IO.Path]::GetFileNameWithoutExtension($_.Name).ToLower() } |
    Sort-Object -Unique

$xmindFiles = Get-ChildItem -Path $RootPath -Recurse -Include "*.xmind" -ErrorAction SilentlyContinue |
    ForEach-Object { [System.IO.Path]::GetFileNameWithoutExtension($_.Name).ToLower() } |
    Sort-Object -Unique

# 创建 HashSet（兼容旧版 PowerShell）
$kmSet = New-Object 'System.Collections.Generic.HashSet[string]'
$xmindSet = New-Object 'System.Collections.Generic.HashSet[string]'

# 添加元素
$kmFiles | ForEach-Object { [void]$kmSet.Add($_) }
$xmindFiles | ForEach-Object { [void]$xmindSet.Add($_) }

# 找出缺失项
$missingXmind = @()
foreach ($name in $kmSet) {
    if (-not $xmindSet.Contains($name)) {
        $missingXmind += $name
    }
}

# 输出结果
Write-Host "?? 统计结果:" -ForegroundColor Cyan
Write-Host "   .km 文件数量: $($kmSet.Count)" -ForegroundColor Green
Write-Host "   .xmind 文件数量: $($xmindSet.Count)" -ForegroundColor Yellow
Write-Host "   缺少 .xmind 的 .km 文件数: $($missingXmind.Count)" -ForegroundColor Red

if ($missingXmind.Count -gt 0) {
    Write-Host "`n??  以下 .km 文件没有对应的 .xmind 文件:" -ForegroundColor Magenta
    $missingXmind | ForEach-Object { Write-Host "   $_" }
} else {
    Write-Host "`n? 所有 .km 文件均有对应的 .xmind 文件！" -ForegroundColor Green
}
pause