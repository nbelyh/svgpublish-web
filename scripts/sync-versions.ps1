# PowerShell script to synchronize versions across all packages in the monorepo

param(
    [string]$NewVersion = ""
)

$packagePaths = @(
  ".",
  "packages/lib",
  "packages/react",
  "packages/webpart",
  "packages/storybook"
)

if ($NewVersion -eq "") {
    # Get the current version from the lib package (considered the main package)
    $rootPackageJson = Get-Content "package.json" | ConvertFrom-Json
    $NewVersion = $rootPackageJson.version
    Write-Host "Using current root version: $NewVersion"
} else {
    Write-Host "Setting all packages to version: $NewVersion"
}

foreach ($packagePath in $packagePaths) {
    $packageJsonPath = "$packagePath/package.json"

    if (Test-Path $packageJsonPath) {
        Write-Host "Updating $packagePath to version $NewVersion"

        # Read package.json
        $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json

        # Update version
        $packageJson.version = $NewVersion

        # Write back to file
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath

        Write-Host "✓ Updated $packagePath"
    } else {
        Write-Warning "Package.json not found at $packageJsonPath"
    }
}

Write-Host ""
Write-Host "Version synchronization complete!"
Write-Host "Don't forget to run 'npm install' to update dependencies."
