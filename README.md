<div align="center">
   <h1>PursuitIQ</h1>
   <p><strong>AI-assisted RFP triage & bid/no-bid intelligence</strong></p>
</div>

## Overview
PursuitIQ ingests RFP documents (PDF, DOCX, TXT) and uses Google Gemini to extract:
* Disciplines required
* Key dates (submission, completion, site visit)
* Risks
* Go / No-Go recommendation with confidence & rationale

Files are stored in Firebase Storage, and analysis runs server-side via a Next.js App Router API route.

## Stack
* Next.js 15 (App Router, React 19, Turbopack)
* TypeScript (strict)
* Tailwind CSS v4
* Google Gemini (gemini-2.5-flash)
* Firebase Admin (Storage)
* mammoth (DOCX raw text extraction)
* UUID, lucide-react icons

## Local Development
```bash
npm install
npm run dev   # http://localhost:3000
```

Environment variables go in `.env.local` (create it). See below.

## Environment Variables
Server-side (Vercel Project Settings > Environment Variables):
```
GOOGLE_AI_API_KEY=********
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-firebase-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-firebase-project-id.appspot.com
```

Optional (client SDK if later needed):
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

### Private Key Formatting
If copying from JSON credentials: keep newlines escaped as `\n`. Do NOT wrap the entire value in extra quotes in Vercel—paste the raw multi-line or escaped form directly.

## Deployment (Vercel)
1. Push repo to GitHub.
2. In Vercel: New Project → Import → select repo.
3. Framework auto-detects Next.js 15 (no custom build command needed). Ensure `NODEJS_18_X`+ runtime default.
4. Add all server env vars (above). Redeploy after any change.
5. Provision Firebase Storage (Firebase Console > Storage > Get Started). The default bucket must exist before uploads work.
6. Create a Service Account (IAM > Service Accounts) with role: Editor or Storage Object Admin. Download JSON and map fields to env vars.
7. Trigger a deployment (git push) and test:
    * `GET /api/storage/health` → `{ ok: true, bucket: "..." }` confirms bucket + permissions.
    * Upload a file via UI; expect JSON analysis response.

## Key API Routes
* `POST /api/analyze` – multipart form upload (field: `file`). Stores file, runs Gemini prompt, returns structured JSON.
* `GET /api/files/:id` – fetches raw stored file bytes.
* `GET /api/storage/health` – bucket existence & permission probe.

## How Analysis Works
1. File uploaded (PDF stored raw; DOCX text extracted with mammoth; TXT read as UTF-8).
2. PDF content sent inline to Gemini (base64) to avoid brittle server parsing.
3. Instruction prompt requests a strict JSON schema.
4. Response cleaned of markdown fences and parsed; merged with storage metadata.

## Troubleshooting
| Symptom | Cause | Fix |
|---------|-------|-----|
| 404 The specified bucket does not exist | Bucket not provisioned or name mismatch | Create bucket in Firebase Console; verify `FIREBASE_STORAGE_BUCKET` exactly matches `<project-id>.appspot.com` |
| 403 on upload | Service account lacks Storage role | Grant Storage Object Admin (or Editor) role in IAM |
| JSON parse error | Model returned extra prose | Improve prompt or add guard to extract JSON substring |
| Private key invalid | Newlines not escaped | Replace real newlines with `\n` in env or use multiline secret |
| Slow first request | Cold start | Subsequent invocations faster; consider warming ping |

## Housekeeping / Project Conventions
* App Router under `app/` only; server-only Firebase Admin usage isolated in `lib/firebaseAdmin.ts`.
* Avoid importing `firebase` client SDK in server routes – use Admin only.
* Turbopack dev commands: `npm run dev` / `npm run build`.
* Lint: `npm run lint` (warnings tuned for velocity).
* Keep large binary parsing minimal; PDFs go straight to model inline.

## Extending
Ideas:
* Add persistence layer (Firestore) for analyses.
* Add auth (NextAuth or Firebase Auth) to track user submissions.
* Implement retry / backoff and JSON schema validation.
* UI for history & filtering by risk level.

## Security Notes
* Service account key lives only in Vercel env vars, not committed.
* Do not expose Gemini key to client; all analysis is server-side.
* Consider rotating keys periodically.

## Scripts
```bash
npm run dev     # Start dev with Turbopack
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Lint codebase
```

## License
Proprietary (internal MVP). Add an OSS license here if you decide to open-source.

---
Maintained by the PursuitIQ team.
