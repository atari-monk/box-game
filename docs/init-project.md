[pl](pl/init-project.md)

## Init Project Script Documentation

### Overview

`init-project.ps1` is a PowerShell automation script that scaffolds a project structure based on a JSON configuration file. It reads a predefined list of folders and files from `init-project.json` and ensures they exist inside a target base directory.

The script is designed to be idempotent: running it multiple times will not overwrite existing files or folders—it will only create missing ones.

---

## What the Script Does

At a high level, the script performs the following steps:

1. **Loads configuration**

   * Reads `init-project.json`
   * Converts it into a strongly-typed `ProjectConfig` object

2. **Resolves paths**

   * Combines `basePath` with each relative folder/file path

3. **Creates folders**

   * Ensures each folder listed in the config exists
   * Creates missing directories only

4. **Creates files**

   * Ensures each file listed in the config exists
   * Creates empty files if they do not exist

5. **Outputs status messages**

   * Logs each creation or skip action to the console

6. **Prints completion message**

   * Confirms initialization is finished

---

## Data Description

### ProjectConfig Class

The script uses a simple data model:

```powershell
class ProjectConfig {
    [string]$BasePath
    [string[]]$Folders
    [string[]]$Files
}
```

#### Properties:

* **BasePath**

  * Root directory where the project will be created
  * Example: `/home/atari-monk/atari-monk/project/box-game`

* **Folders**

  * Array of relative folder paths to create under `BasePath`
  * Example:

    * `src`
    * `scripts`
    * `src/oop`

* **Files**

  * Array of relative file paths to create under `BasePath`
  * Example:

    * `package.json`
    * `src/main.ts`
    * `src/oop/game.ts`

---

### Configuration File (init-project.json)

The JSON file defines the entire project structure:

```json
{
  "basePath": "/home/atari-monk/atari-monk/project/box-game",
  "folders": [
    "src",
    "scripts",
    "docs",
    "prompts",
    "sounds",
    "src/oop"
  ],
  "files": [
    "package.json",
    "tsconfig.json",
    ".gitignore",
    "index.html",
    "favicon.png",
    "src/styles.css",
    "src/player.ts",
    "src/game.ts",
    "src/main.ts",
    "src/oop/game.ts",
    "src/oop/player.ts"
  ]
}
```

#### Key ideas:

* **basePath**

  * Absolute root directory of the project

* **folders**

  * Structure-only definitions (directories)

* **files**

  * File scaffolding (empty file creation)

---

## Internal Function Breakdown

### Load-ProjectConfig

* Reads JSON config file
* Validates that it exists
* Converts JSON into `ProjectConfig` object

### Join-ProjectPath

* Combines base path with relative paths
* Uses PowerShell’s `Join-Path` for OS-safe path handling

### Create-Folder

* Creates directory if missing
* Prints status message

### Create-File

* Creates empty file if missing
* Prints status message

### Initialize-Folders

* Iterates through folder list
* Creates each folder under base path

### Initialize-Files

* Iterates through file list
* Creates each file under base path

### Main

* Entry point
* Loads config
* Runs folder and file initialization
* Prints completion message

---

## Usage

### 1. Prepare configuration

Edit or create:

```
scripts/init-project.json
```

Define:

* `basePath`
* folder structure
* file structure

---

### 2. Run the script

From a PowerShell terminal:

```powershell
cd scripts
.\init-project.ps1
```

---

### 3. Expected output

Example output:

```
Created folder: /home/.../box-game/src
Created folder: /home/.../box-game/scripts
Created file: /home/.../box-game/package.json
Created file: /home/.../box-game/src/main.ts

box-game init project complete
```

If items already exist:

```
Folder already exists: ...
File already exists: ...
```

---

### 4. Re-run safety

You can safely run the script multiple times:

* No duplication
* No overwriting
* Only missing items are created

---

## Summary

This script is a lightweight project scaffolding tool that:

* Reads a declarative JSON structure
* Builds folder/file structure automatically
* Avoids overwriting existing work
* Provides repeatable project initialization

It is especially useful for quickly bootstrapping consistent project layouts (like game projects, frontend apps, or modular codebases).