# GIBIConnect Manual Testing Guide

Copy-paste commands to test the backend manually on Windows.

---

## 0. Before you start

### Start PostgreSQL
Make sure your database exists and schema is applied.

### Start backend
```powershell
cd C:\Users\hp\GIBIConnect\backend
npm run dev
```

Default API URL: `http://localhost:5000`

### Start Ollama (for AI tests only)
```powershell
ollama serve
ollama pull llama3.2
ollama pull nomic-embed-text
```

---

## 1. Run everything automatically (recommended)

```powershell
cd C:\Users\hp\GIBIConnect\backend
.\scripts\manual-test.ps1
```

Optional custom values:
```powershell
$env:GIBI_BASE_URL = "http://localhost:5000"
$env:GIBI_TEST_EMAIL = "you@example.com"
$env:GIBI_TEST_PASSWORD = "Password123!"
.\scripts\manual-test.ps1
```

---

## 2. Run automated unit tests

```powershell
cd C:\Users\hp\GIBIConnect\backend
npm test
```

Expected:
```
Test Suites: 7 passed
Tests:       39 passed
```

---

## 3. Database manual tests

### Verify all 35 tables + constraints
```powershell
psql -U postgres -d gibiconnect_db -f database\verification\verify.sql
```

### Quick connection test
```sql
SELECT current_database(), now();
SELECT count(*) FROM institutions;
SELECT count(*) FROM programs;
SELECT count(*) FROM resources;
SELECT count(*) FROM research;
```

### Full-text search test
```sql
SELECT id, title
FROM resources
WHERE search_vector @@ websearch_to_tsquery('english', 'machine learning')
LIMIT 5;
```

### Fuzzy search test
```sql
SELECT name, similarity(name, 'Addis Ababa University') AS score
FROM institutions
WHERE name % 'Addis Ababa University'
ORDER BY score DESC
LIMIT 5;
```

---

## 4. Manual API tests (PowerShell)

Set helpers once:
```powershell
$Base = "http://localhost:5000"
$Headers = @{ "Content-Type" = "application/json" }
```

### 4.1 Health
```powershell
Invoke-RestMethod -Uri "$Base/api/health"
```

Expected: `success = true`, database healthy.

---

### 4.2 Register
```powershell
$body = @{
  full_name = "Manual Test User"
  email = "manual.test@example.com"
  password = "Password123!"
  role = "user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$Base/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

Expected: `201`, returns `data.token`.

---

### 4.3 Login
```powershell
$body = @{
  email = "manual.test@example.com"
  password = "Password123!"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "$Base/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$Token = $login.data.token
$Token
```

Save token:
```powershell
$Auth = @{ Authorization = "Bearer $Token" }
```

---

### 4.4 Current user
```powershell
Invoke-RestMethod -Uri "$Base/api/auth/me" -Headers $Auth
```

Expected: your profile, no password hash.

---

### 4.5 Negative auth tests

Missing token:
```powershell
try {
  Invoke-RestMethod -Uri "$Base/api/auth/me"
} catch {
  $_.Exception.Response.StatusCode.value__
}
```
Expected: `401`

Wrong password:
```powershell
$body = @{ email = "manual.test@example.com"; password = "WrongPassword!" } | ConvertTo-Json
try {
  Invoke-RestMethod -Uri "$Base/api/auth/login" -Method POST -Body $body -ContentType "application/json"
} catch {
  $_.Exception.Response.StatusCode.value__
}
```
Expected: `401`

Duplicate email:
```powershell
$body = @{
  full_name = "Another User"
  email = "manual.test@example.com"
  password = "Password123!"
} | ConvertTo-Json

try {
  Invoke-RestMethod -Uri "$Base/api/auth/register" -Method POST -Body $body -ContentType "application/json"
} catch {
  $_.Exception.Response.StatusCode.value__
}
```
Expected: `409`

---

## 5. Institutions API

### List with filters
```powershell
Invoke-RestMethod -Uri "$Base/api/institutions?page=1&limit=10"
Invoke-RestMethod -Uri "$Base/api/institutions?region=Addis%20Ababa&type=university"
Invoke-RestMethod -Uri "$Base/api/institutions?search=university"
```

### Get by ID
Replace `INSTITUTION_ID` with a real UUID from the list response.
```powershell
$instId = "INSTITUTION_ID"
Invoke-RestMethod -Uri "$Base/api/institutions/$instId"
```

### Get by slug
```powershell
Invoke-RestMethod -Uri "$Base/api/institutions/addis-ababa-university"
```

### Nested institution data
```powershell
$instId = "INSTITUTION_ID"
Invoke-RestMethod -Uri "$Base/api/institutions/$instId/faculties"
Invoke-RestMethod -Uri "$Base/api/institutions/$instId/programs"
Invoke-RestMethod -Uri "$Base/api/institutions/$instId/admissions"
Invoke-RestMethod -Uri "$Base/api/institutions/$instId/tuition"
Invoke-RestMethod -Uri "$Base/api/institutions/$instId/scholarships"
Invoke-RestMethod -Uri "$Base/api/institutions/$instId/facilities"
Invoke-RestMethod -Uri "$Base/api/institutions/$instId/reviews"
Invoke-RestMethod -Uri "$Base/api/institutions/$instId/resources"
```

### Create institution (admin only)
```powershell
$body = @{
  name = "Test University"
  slug = "test-university"
  type = "university"
  ownership = "public"
  city = "Addis Ababa"
  region = "Addis Ababa"
  description = "Manual test institution"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$Base/api/institutions" -Method POST -Headers $Auth -Body $body -ContentType "application/json"
```
Expected without admin role: `403`

---

## 6. Search API

```powershell
Invoke-RestMethod -Uri "$Base/api/search?q=artificial%20intelligence"
Invoke-RestMethod -Uri "$Base/api/search?q=scholarship"
Invoke-RestMethod -Uri "$Base/api/search?q=admission"
```

Expected: grouped results from institutions/programs/resources/research.

---

## 7. Resources API

### List
```powershell
Invoke-RestMethod -Uri "$Base/api/resources?page=1&limit=10"
Invoke-RestMethod -Uri "$Base/api/resources?resource_type=document"
```

### Get one resource
```powershell
$resourceId = "RESOURCE_ID"
Invoke-RestMethod -Uri "$Base/api/resources/$resourceId"
```

### Download
```powershell
Invoke-WebRequest -Uri "$Base/api/resources/$resourceId/download" -OutFile "downloaded-file.pdf"
```

### Upload a PDF (multipart)
Create a test file first:
```powershell
"This is a GIBIConnect manual test document." | Out-File -FilePath ".\test-upload.txt" -Encoding utf8
```

Upload with curl (easier for multipart on Windows):
```powershell
curl.exe -X POST "$Base/api/resources/upload" `
  -F "file=@test-upload.txt" `
  -F "title=Manual Test Document" `
  -F "description=Uploaded during manual testing" `
  -F "resource_type=document" `
  -F "visibility=public"
```

Expected: `201`, resource created.

### Approve resource (moderator/admin)
```powershell
Invoke-RestMethod -Uri "$Base/api/resources/$resourceId/approve" -Method PATCH -Headers $Auth
```

### Reject resource (moderator/admin)
```powershell
$body = @{ reason = "Missing citation" } | ConvertTo-Json
Invoke-RestMethod -Uri "$Base/api/resources/$resourceId/reject" -Method PATCH -Headers $Auth -Body $body -ContentType "application/json"
```

---

## 8. Research API

```powershell
Invoke-RestMethod -Uri "$Base/api/research?page=1&limit=10"
Invoke-RestMethod -Uri "$Base/api/research?research_type=thesis"

$researchId = "RESEARCH_ID"
Invoke-RestMethod -Uri "$Base/api/research/$researchId"
```

---

## 9. AI / RAG API

### AI health
```powershell
Invoke-RestMethod -Uri "$Base/api/ai/health"
```

Expected checks:
- PostgreSQL
- pgvector
- Ollama
- embedding model
- LLM model

### AI consultation
```powershell
$body = @{
  prompt = "Which universities offer Artificial Intelligence programs in Addis Ababa?"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$Base/api/ai/consult" -Method POST -Body $body -ContentType "application/json"
```

With institution context:
```powershell
$body = @{
  prompt = "What are the admission requirements?"
  institution_id = "INSTITUTION_ID"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$Base/api/ai/consult" -Method POST -Body $body -ContentType "application/json"
```

Expected response shape:
```json
{
  "success": true,
  "data": {
    "response": "...",
    "conversation_id": "...",
    "citations": []
  }
}
```

### Semantic vector search
```powershell
Invoke-RestMethod -Uri "$Base/api/ai/search?q=admission%20requirements"
```

POST version:
```powershell
$body = @{
  q = "tuition fee for bachelor programs"
  topK = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri "$Base/api/ai/search" -Method POST -Body $body -ContentType "application/json"
```

### Ingest resource into vector store
```powershell
$body = @{ resource_id = "RESOURCE_ID" } | ConvertTo-Json
Invoke-RestMethod -Uri "$Base/api/ai/ingest" -Method POST -Body $body -ContentType "application/json"
```

Ingest all approved resources:
```powershell
$body = @{ all = $true } | ConvertTo-Json
Invoke-RestMethod -Uri "$Base/api/ai/ingest" -Method POST -Body $body -ContentType "application/json"
```

---

## 10. Security manual checks

### Invalid JWT
```powershell
$bad = @{ Authorization = "Bearer invalid.token.here" }
try {
  Invoke-RestMethod -Uri "$Base/api/auth/me" -Headers $bad
} catch {
  $_.Exception.Response.StatusCode.value__
}
```
Expected: `401`

### Access admin-only route as normal user
```powershell
try {
  Invoke-RestMethod -Uri "$Base/api/institutions" -Method POST -Headers $Auth -Body '{}' -ContentType "application/json"
} catch {
  $_.Exception.Response.StatusCode.value__
}
```
Expected: `403` unless your token role is `admin`

### Upload blocked file type
```powershell
"fake exe" | Out-File -FilePath ".\bad.exe" -Encoding ascii
curl.exe -X POST "$Base/api/resources/upload" -F "file=@bad.exe" -F "title=Bad File"
```
Expected: `400` unsupported extension

---

## 11. curl versions (if you prefer curl)

```bash
# Health
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"full_name\":\"Manual Test User\",\"email\":\"manual.test@example.com\",\"password\":\"Password123!\"}"

# Login
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"manual.test@example.com\",\"password\":\"Password123!\"}"

# Institutions
curl "http://localhost:5000/api/institutions?page=1&limit=5"

# Search
curl "http://localhost:5000/api/search?q=university"

# AI consult
curl -X POST http://localhost:5000/api/ai/consult ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"Which universities offer AI programs?\"}"
```

---

## 12. Expected pass/fail checklist

| Test | Expected |
|---|---|
| `GET /api/health` | 200, DB connected |
| `POST /api/auth/register` | 201 + token |
| `POST /api/auth/login` | 200 + token |
| `GET /api/auth/me` with token | 200 profile |
| `GET /api/auth/me` without token | 401 |
| `GET /api/institutions` | 200 paginated list |
| `GET /api/institutions/:id/programs` | 200 array |
| `GET /api/search?q=` | 200 results |
| `GET /api/resources` | 200 list |
| `GET /api/research` | 200 list |
| `GET /api/ai/health` | 200 or 503 if Ollama down |
| `POST /api/ai/consult` | 200 grounded answer |
| Upload `.exe` file | 400 rejected |
| `npm test` | 39/39 pass |
| `verify.sql` | all checks succeed |

---

## 13. Troubleshooting

| Problem | Fix |
|---|---|
| `ECONNREFUSED localhost:5000` | Run `npm run dev` |
| Database unavailable | Check PostgreSQL + `.env` DB settings |
| AI health degraded | Start Ollama and pull models |
| Register returns 409 | Email already exists; use login instead |
| Empty institution list | Run seed SQL |
| Semantic search empty | Run AI ingest on approved resources |
