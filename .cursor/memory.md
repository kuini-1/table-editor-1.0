# 🧠 Project Memory
> This file is maintained automatically by Cursor. Do not delete.
> Last updated: 2026-03-29
> Total rules: 0 active

---

## How To Read This File
- ⛔ CRITICAL — Hardcoded law, never deviate
- 🔴 HIGH — Always follow, no exceptions  
- 🟡 MEDIUM — Follow consistently
- 🟢 LOW — Follow when relevant

---

## 📋 Active Rules

<!-- Cursor will automatically add rules here as you correct it -->

---

## 📊 Correction Log
> Automatic log of all corrections made

| Date | Project | What Was Wrong | What Is Correct | Importance |
|------|---------|---------------|-----------------|------------|
| | | | | |

---

## 🏗️ Project Architecture Notes

### C++ Server
<!-- Cursor will document architecture decisions here -->

### Website
<!-- Cursor will document UI patterns, libraries, conventions here -->

### Web Bridge
<!-- Cursor will document API patterns here -->

### Launcher
<!-- Cursor will document launcher-specific patterns here -->

---

## ⛔ Never Use These

| Library/Pattern | Reason | Project | Importance |
|----------------|--------|---------|------------|
| | | | |

---

## ✅ Always Use These

| Library/Pattern | Instead Of | Project | Importance |
|----------------|-----------|---------|------------|
| | | | |

---
## [ALL] — Use project `exports` root
- Importance: 🟢 LOW
- Correction count: 1
- Rule: Always use the project/repo `exports` directory (e.g. `process.cwd()/exports`) for `Convert.exe` and for reading/writing converted files. Do not hardcode `C:\\xampp\\htdocs\\table-editor\\exports`.
- Context: ALL
- Example: Wrong: `C:\\xampp\\htdocs\\table-editor\\exports` ; Correct: `path.join(process.cwd(), 'exports')`
- Last updated: 2026-03-30