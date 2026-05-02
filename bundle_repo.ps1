$OutputFile = "gemini_context.txt"

Write-Host "Generating repository map and bundling code..."

# Remove the file if it exists and is locked
if (Test-Path $OutputFile) {
    Remove-Item $OutputFile -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500  # Give Windows time to release the file
}

# Create a new file
$null = New-Item -Path $OutputFile -ItemType File -Force

# Define the folders we want to ignore (regex format)
$SkipFolders = '\\build\\|\\.git\\|\\.expo\\|\\node_modules\\|\\android\\|\\ios\\|\\.next\\|\\dist\\|\\.stitch_service_marketplace_platform\\'

# Collect all content first, then write it all at once
$content = @()

# Find all TypeScript/JavaScript/JSON/YAML files, skip the ignored folders, and bundle them
Get-ChildItem -Path . -Recurse -File | Where-Object {
    ($_.Extension -in ".tsx", ".ts", ".jsx", ".js", ".json", ".yaml", ".yml", ".md") -and ($_.FullName -notmatch $SkipFolders)
} | ForEach-Object {
    # Get the relative path for cleaner reading
    $RelativePath = $_.FullName.Substring($PWD.Path.Length + 1)
    
    $content += "========================================"
    $content += "FILE PATH: $RelativePath"
    $content += "========================================"
    
    # Read the file and append its contents
    $content += (Get-Content $_.FullName -Raw)
    $content += "`n`n"
}

# Write all content at once
$content | Out-File -FilePath $OutputFile -Encoding UTF8

Write-Host "Done! Codebase bundled into $OutputFile"
Write-Host "Total size: $((Get-Item $OutputFile).Length / 1KB)KB"