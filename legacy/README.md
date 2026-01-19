# Legacy Interview Pass – Google Apps Script

This directory contains a **read-only snapshot** of the original Interview Pass Google Apps Script codebase.

## ⚠️ Important

- **DO NOT edit files here directly** – this is a reference copy
- **Changes will not sync back** to the original Apps Script project
- **Use for migration reference only** – new features are built in the parent NexusJS monorepo

## What's Inside

- **`src/`** – 13 Google Apps Script files (Code.gs, Router.gs, APIs, configs)
- **`Config/`** & **`API/`** – Deprecated old folder structure
- **Documentation** – Setup guides, status files, connection instructions

## Re-Sync Legacy Codebase

If the original Interview Pass repo is updated and you need a fresh copy:

```bash
cd Interview-Pass-NexusJS
rm -rf legacy/interview-pass-old
git clone https://github.com/crewlife-hub/Interview-Pass.git legacy/interview-pass-old
```

## Learn More

- See [docs/legacy-inventory.md](../docs/legacy-inventory.md) for detailed codebase summary
- See [docs/MIGRATION.md](../docs/MIGRATION.md) for migration strategy
- Original README: [legacy/interview-pass-old/README.md](interview-pass-old/README.md)

---

**Status:** Read-only snapshot  
**Last Updated:** January 19, 2026
