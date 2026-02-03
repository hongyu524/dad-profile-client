# Base44 App

## AWS Credentials (Required)

Use the dedicated profile `stocks-app-importer` and never `trace-media-service`.

Configure and verify:
```
aws configure --profile stocks-app-importer
$env:AWS_PROFILE="stocks-app-importer"
aws sts get-caller-identity
```

Expected ARN: `arn:aws:iam::304361287173:user/stocks-app-importer`

Set these env vars (example):
```
AWS_PROFILE=stocks-app-importer
AWS_REGION=us-west-2
TABLE_NAME=AppData
CSV_PATH=./Stock_export.csv
```
