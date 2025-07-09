#!/usr/bin/env pwsh

# Set environment variables
$env:ASPNETCORE_URLS = "http://localhost:5168"
$env:ASPNETCORE_ENVIRONMENT = "Development"

# Get script directory and navigate to WebAPI
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptDir\CleanArchitecture.WebAPI"

# Run the application from WebAPI directory (not bin)
dotnet run
