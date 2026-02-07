# fix-backfill.ps1
# Read Stock_export.csv and update DynamoDB AppData table

$ErrorActionPreference = "Stop"

$PROFILE_NAME = "stocks"
$REGION = "us-west-2"
$TABLE = "AppData"

Write-Host "Loading CSV..."
$rows = Import-Csv ".\Stock_export.csv"

foreach ($r in $rows) {

    $pk = "STOCKS#$($r.year)"
    $sk = "CODE#$($r.code)"

    Write-Host "Updating $pk / $sk  ($($r.name))"

    $update = @{
        TableName = $TABLE
        Key = @{
            PK = @{ S = $pk }
            SK = @{ S = $sk }
        }
        UpdateExpression = @"
SET
    #name = :name,
    total_shares = :total,
    circulating_shares = :cir,
    restricted_shares = :res,
    profit = :profit,
    industry_74 = :ind
"@
        ExpressionAttributeNames = @{
            "#name" = "name"
        }
        ExpressionAttributeValues = @{
            ":name"   = @{ S = $r.name }
            ":total"  = @{ N = $r.total_shares }
            ":cir"    = @{ N = $r.circulating_shares }
            ":res"    = @{ N = $r.restricted_shares }
            ":profit" = @{ S = $r.profit }
            ":ind"    = @{ S = $r.industry_74 }
        }
    }

    $json = $update | ConvertTo-Json -Depth 10

    $json | Out-File "tmp.json" -Encoding utf8

    aws dynamodb update-item `
        --cli-input-json file://tmp.json `
        --profile $PROFILE_NAME `
        --region $REGION

}

Write-Host "✅ Backfill finished!"
