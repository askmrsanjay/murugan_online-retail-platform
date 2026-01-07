$artifactPath = "C:\Users\SANJAY\.gemini\antigravity\brain\24e297ca-8244-4371-a86d-0431309e326e"
$docsPath = "docs"

Copy-Item "$artifactPath\task.md" -Destination "$docsPath\task.md" -Force
Copy-Item "$artifactPath\implementation_plan.md" -Destination "$docsPath\implementation_plan.md" -Force
Copy-Item "$artifactPath\walkthrough.md" -Destination "$docsPath\walkthrough.md" -Force

Write-Host "Documentation synced to docs/ folder. Don't forget to commit and push!"
