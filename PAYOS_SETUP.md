# PayOS Setup Guide

## 🔐 Security Notice
**NEVER commit PayOS credentials to version control!**

## 📋 Required PayOS Credentials

You need to obtain these from your PayOS dashboard:
- `ClientId`
- `ApiKey` 
- `ChecksumKey`

## 🛠️ Development Setup

### 1. Create appsettings.Development.json

Create `BE/CleanArchitecture.WebAPI/appsettings.Development.json` with your real credentials:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "PayOS": {
    "ClientId": "YOUR_PAYOS_CLIENT_ID",
    "ApiKey": "YOUR_PAYOS_API_KEY", 
    "ChecksumKey": "YOUR_PAYOS_CHECKSUM_KEY",
    "ReturnUrl": "http://localhost:3000/payment/return",
    "CancelUrl": "http://localhost:3000/payment/cancel",
    "WebhookUrl": "http://localhost:5168/api/payment/webhook"
  }
}
```

### 2. Environment Variables (Alternative)

Or set environment variables:
```bash
export PAYOS_CLIENT_ID="your_client_id"
export PAYOS_API_KEY="your_api_key"
export PAYOS_CHECKSUM_KEY="your_checksum_key"
```

### 3. Production Setup

For production, use:
- Environment variables
- Azure Key Vault
- AWS Secrets Manager
- Or other secure secret management

## 🚀 Getting Started

1. **Get PayOS credentials** from https://payos.vn
2. **Create appsettings.Development.json** with your credentials
3. **Run the application**:
   ```bash
   cd BE
   dotnet run --project CleanArchitecture.WebAPI
   ```

## ⚠️ Important Notes

- `appsettings.Development.json` is in `.gitignore` - it won't be committed
- Never put real credentials in `appsettings.json`
- Use sandbox credentials for testing
- Use production credentials only in production environment

## 🔗 PayOS Documentation

- [PayOS Developer Guide](https://payos.vn/docs)
- [PayOS .NET SDK](https://github.com/payOSHQ/payos-lib-net)
