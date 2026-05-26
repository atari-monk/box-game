$date = Get-Date -Format "yyyy-MM-dd"

git log --reverse --pretty=format:"%ad %s" --date=short |
Where-Object { $_.StartsWith("$date ") } |
ForEach-Object { $_.Substring($date.Length + 1) }