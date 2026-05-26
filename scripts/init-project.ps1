# =========================================
# Structs (Classes)
# =========================================

class ProjectConfig {
    [string]$BasePath
    [string[]]$Folders
    [string[]]$Files
}

# =========================================
# Load Functions
# =========================================

function Load-ProjectConfig {
    param (
        [string]$ConfigPath
    )

    if (-not (Test-Path $ConfigPath)) {
        throw "Config file not found: $ConfigPath"
    }

    $json = Get-Content $ConfigPath -Raw | ConvertFrom-Json

    $config = [ProjectConfig]::new()
    $config.BasePath = $json.basePath
    $config.Folders  = $json.folders
    $config.Files    = $json.files

    return $config
}

# =========================================
# Path Functions
# =========================================

function Join-ProjectPath {
    param (
        [string]$BasePath,
        [string]$RelativePath
    )

    return Join-Path $BasePath $RelativePath
}

# =========================================
# Create Functions
# =========================================

function Create-Folder {
    param (
        [string]$Path
    )

    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
        Write-Host "Created folder: $Path"
    }
    else {
        Write-Host "Folder already exists: $Path"
    }
}

function Create-File {
    param (
        [string]$Path
    )

    if (-not (Test-Path $Path)) {
        New-Item -ItemType File -Path $Path | Out-Null
        Write-Host "Created file: $Path"
    }
    else {
        Write-Host "File already exists: $Path"
    }
}

# =========================================
# Process Functions
# =========================================

function Initialize-Folders {
    param (
        [ProjectConfig]$Config
    )

    foreach ($folder in $Config.Folders) {
        $fullPath = Join-ProjectPath `
            -BasePath $Config.BasePath `
            -RelativePath $folder

        Create-Folder -Path $fullPath
    }
}

function Initialize-Files {
    param (
        [ProjectConfig]$Config
    )

    foreach ($file in $Config.Files) {
        $fullPath = Join-ProjectPath `
            -BasePath $Config.BasePath `
            -RelativePath $file

        Create-File -Path $fullPath
    }
}

# =========================================
# Main
# =========================================

function Main {

    $configPath = Join-Path $PSScriptRoot "init-project.json"

    $config = Load-ProjectConfig `
        -ConfigPath $configPath

    Initialize-Folders -Config $config
    Initialize-Files   -Config $config

    Write-Host ""
    Write-Host "box-game init project complete"
}

Main