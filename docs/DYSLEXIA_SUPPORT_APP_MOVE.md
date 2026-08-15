# Move to Dyslexia-support-app

The HERO + Speed dyslexia reading app is prepared in this repo at:

- `dyslexia-support-app/` — standalone app ready to push
- `scripts/push-to-dyslexia-support-app.sh` — one-shot transfer script

Target: https://github.com/clauslarbietech/Dyslexia-support-app

## Why push is blocked for the agent

The Cursor GitHub App currently only has access to `clauslarbietech/CV`.
Invite/collaborator alone is not enough — install/configure the **Cursor** GitHub App on `Dyslexia-support-app` (GitHub → Settings → Applications → Cursor → Repository access).

## After granting access

Tell the agent to **proceed** again, or run locally:

```bash
./scripts/push-to-dyslexia-support-app.sh
```
