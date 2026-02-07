# scripts/bulk-backfill-shares.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$BaseDir = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }
$csvPath = Join-Path $BaseDir "..\Stock_export.csv"
$TableName = "AppData"
$Region    = "us-west-2"

# Robust number parser: Handles commas, spaces, and Chinese units
function ToIntString($v) {
    if ($null -eq $v -or [string]::IsNullOrWhiteSpace($v)) { return "0" }
    $s = [string]$v -replace "[^\d\.\u4ebf\u4e07]", "" 
    $multiplier = 1
    if ($s -match "\u4ebf") { $multiplier = 100000000; $s = $s -replace "[^\d\.]", "" }
    elseif ($s -match "\u4e07") { $multiplier = 10000; $s = $s -replace "[^\d\.]", "" }
    
    if ($s -as [double]) {
        return ([int64][math]::Round(([double]$s * $multiplier), 0)).ToString()
    }
    return "0"
}

if (-not (Test-Path $csvPath)) { $csvPath = ".\Stock_export.csv" }
$data = Import-Csv $csvPath

Write-Host "Starting update for table: $TableName" -ForegroundColor Cyan

foreach ($row in $data) {
    # 1. Standardize Code
    $code = ($row.code -replace "\D", "").PadLeft(6, '0')
    if ($code -eq "000000" -or -not $code) { continue }

    # 2. Extract Values
    $total = ToIntString $row.total_shares
    $circ  = ToIntString $row.circulating_shares
    $rest  = ToIntString $row.restricted_shares
    
    # 3. FIX: If circulating is 0, calculate it manually
    $float = $circ
    if ($float -eq "0" -and $total -ne "0") {
        $float = ([int64]$total - [int64]$rest).ToString()
    }

    # 4. Skip if row is truly empty
    if ($total -eq "0" -and $float -eq "0") { continue }

    $pk = "STOCKS#2024"
    $sk = "CODE#$code"
    
    $payload = @{
        TableName = $TableName
        Key = @{ PK = @{ S = $pk }; SK = @{ S = $sk } }
        UpdateExpression = "SET totalShares = :ts, floatShares = :fs, circulating_shares = :cs, restricted_shares = :rs"
        ExpressionAttributeValues = @{
            ":ts" = @{ N = $total }
            ":fs" = @{ N = $float }
            ":cs" = @{ N = $circ }
            ":rs" = @{ N = $rest }
        }
    }
    
    $tmpJsonPath = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllText($tmpJsonPath, ($payload | ConvertTo-Json -Compress))
    
    # Log progress with values so you can see if they are 0
    Write-Host "Updating $code : T=$total, F=$float..." -NoNewline
    $null = aws dynamodb update-item --cli-input-json ("file://{0}" -f $tmpJsonPath) --region $Region
    Write-Host " [OK]" -ForegroundColor Green
    
    if (Test-Path $tmpJsonPath) { Remove-Item $tmpJsonPath }
}

Write-Host "`nBackfill Complete!" -ForegroundColor Magenta