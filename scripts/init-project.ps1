$base = "/home/atari-monk/atari-monk/project/box-game"

$folders = @(
    "$base/src",
    "$base/scripts",
    "$base/docs",
    "$base/prompts",
    "$base/sounds",
    "$base/src/oop"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "Created folder: $folder"
    }
    else {
        Write-Host "Folder already exists: $folder"
    }
}

$files = @(
    "$base/package.json",
    "$base/tsconfig.json",
    "$base/.gitignore",

    "$base/index.html",
    "$base/favicon.png",
    "$base/src/styles.css",

    "$base/src/player.ts",
    "$base/src/game.ts",
    "$base/src/main.ts",

    "$base/src/oop/game.ts",
    "$base/src/oop/player.ts"
)

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
        Write-Host "Created file: $file"
    }
    else {
        Write-Host "File already exists: $file"
    }
}

Write-Host "box-game init project complete"