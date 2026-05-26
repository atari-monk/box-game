#!/usr/bin/env python3

from __future__ import annotations

from pathlib import Path


BASE_PATH: Path = Path("/home/atari-monk/atari-monk/project/box-game")
DOCS_PATH: Path = BASE_PATH / "docs"
PL_DOCS_PATH: Path = DOCS_PATH / "pl"


def ask_non_empty(prompt: str) -> str:
    while True:
        value: str = input(prompt).strip()

        if value:
            return value

        print("Value cannot be empty.")


def append_line(path: Path, line: str) -> None:
    with path.open("a", encoding="utf-8") as file:
        file.write(f"\n{line}")


def write_file(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)

    with path.open("w", encoding="utf-8") as file:
        file.write(content)


def main() -> None:
    file_name: str = ask_non_empty("File name (without .md): ")
    en_title: str = ask_non_empty("EN title: ")
    pl_title: str = ask_non_empty("PL title: ")

    normalized_file_name: str = (
        file_name[:-3] if file_name.endswith(".md") else file_name
    )

    en_doc_path: Path = DOCS_PATH / f"{normalized_file_name}.md"
    pl_doc_path: Path = PL_DOCS_PATH / f"{normalized_file_name}.md"

    en_content: str = f"[pl](pl/{normalized_file_name}.md)\n"
    pl_content: str = f"[en](../{normalized_file_name}.md)\n"

    write_file(en_doc_path, en_content)
    write_file(pl_doc_path, pl_content)

    append_line(
        DOCS_PATH / "index.md",
        f"- [{en_title}]({normalized_file_name}.md)",
    )

    append_line(
        PL_DOCS_PATH / "index.md",
        f"- [{pl_title}]({normalized_file_name}.md)",
    )

    print(f"Created: {en_doc_path}")
    print(f"Created: {pl_doc_path}")


if __name__ == "__main__":
    main()