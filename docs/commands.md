## Logging Minutes

Skróty w .bashrc, np.:

```sh
code ~/.bashrc
```

Zapisz:

```sh
alias logstart='echo -e "\n## $(date "+%Y-%m-%d %H:%M") START\n" >> docs/minutes.md'
alias logdone='echo "- [x] $(date "+%H:%M") DONE:" >> docs/minutes.md'
alias lognote='echo "- $(date "+%H:%M") NOTE:" >> docs/minutes.md'
```

Przeładuj:

```sh
source ~/.bashrc
```

Użycie:

```sh
cd project
logstart
logdone poprawiono sprite
lognote muzyka + poduszka działa
```