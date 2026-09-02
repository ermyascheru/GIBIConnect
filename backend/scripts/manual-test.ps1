# GIBIConnect Manual API Test Script (PowerShell)
# Usage:
#   1. Start backend:  npm run dev
#   2. Run this file:  .\scripts\manual-test.ps1
#
# Optional env vars before running:
#   $env:GIBI_BASE_URL = "http://localhost:5000"
#   $env:GIBI_TEST_EMAIL = "manual.test@example.com"
#   $env:GIBI_TEST_PASSWORD = "Password123!"

$ErrorActionPreference = "Stop"

$BaseUrl = if ($env:GIBI_BASE_URL) { $env:GIBI_BASE_URL } else { "http://localhost:5000" }
$Email = if ($env:GIBI_TEST_EMAIL) { $env:GIBI_TEST_EMAIL } else { "manual.test@example.com" }
$Password = if ($env:GIBI_TEST_PASSWORD) { $env:GIBI_TEST_PASSWORD } else { "Password123!" }
$FullName = "Manual Test User"

function Write-Step($title) {
  Write-Host ""
  Write-Host "==================================================" -ForegroundColor Cyan
  Write-Host $title -ForegroundColor Cyan
  Write-Host "==================================================" -ForegroundColor Cyan
}

function Invoke-Api {
  param(
    [string]$Method = "GET",
    [string]$Path,
    [object]$Body = $null,
    [string]$Token = $null,
    [hashtable]$Headers = @{}
  )

  $uri = "$BaseUrl$Path"
  $params = @{
    Uri = $uri
    Method = $Method
    ContentType = "application/json"
    ErrorAction = "Stop"
  }

  if ($Body -ne $null) {
    $params.Body = ($Body | ConvertTo-Json -Depth 10)
  }

  if ($Token) {
    $params.Headers = @{ Authorization = "Bearer $Token" }
  }

  foreach ($key in $Headers.Keys) {
    if (-not $params.Headers) { $params.Headers = @{} }
    $params.Headers[$key] = $Headers[$key]
  }

  try {
    $response = Invoke-RestMethod @params
    return $response
  } catch {
    if ($_.Exception.Response) {
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $raw = $reader.ReadToEnd()
      Write-Host "HTTP ERROR: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
      Write-Host $raw -ForegroundColor Red
    } else {
      Write-Host $_.Exception.Message -ForegroundColor Red
    }
    throw
  }
}

function Show-Result($label, $response) {
  Write-Host "$label" -ForegroundColor Green
  $response | ConvertTo-Json -Depth 8
}

Write-Host "GIBIConnect Manual Test Runner" -ForegroundColor Yellow
Write-Host "Base URL: $BaseUrl"

# --------------------------------------------------
# 1. HEALTH
# --------------------------------------------------
Write-Step "1. Health Check"
$health = Invoke-Api -Path "/api/health"
Show-Result "Server health:" $health

# --------------------------------------------------
# 2. AUTH - REGISTER
# --------------------------------------------------
Write-Step "2. Register User"
try {
  $register = Invoke-Api -Method POST -Path "/api/auth/register" -Body @{
    full_name = $FullName
    email = $Email
    password = $Password
    role = "user"
  }
  Show-Result "Register response:" $register
} catch {
  Write-Host "Register failed (user may already exist). Trying login..." -ForegroundColor Yellow
}

# --------------------------------------------------
# 3. AUTH - LOGIN
# --------------------------------------------------
Write-Step "3. Login User"
$login = Invoke-Api -Method POST -Path "/api/auth/login" -Body @{
  email = $Email
  password = $Password
}
Show-Result "Login response:" $login

$Token = $login.data.token
if (-not $Token) {
  throw "No JWT token returned from login."
}

# --------------------------------------------------
# 4. AUTH - ME
# --------------------------------------------------
Write-Step "4. Get Current User (/api/auth/me)"
$me = Invoke-Api -Path "/api/auth/me" -Token $Token
Show-Result "Current user:" $me

# --------------------------------------------------
# 5. INSTITUTIONS
# --------------------------------------------------
Write-Step "5. List Institutions"
$institutions = Invoke-Api -Path "/api/institutions?page=1&limit=5"
Show-Result "Institutions:" $institutions

$institutionId = $null
if ($institutions.data -and $institutions.data.Count -gt 0) {
  $institutionId = $institutions.data[0].id
  $institutionSlug = $institutions.data[0].slug
  Write-Host "Using institution ID: $institutionId" -ForegroundColor Yellow
  Write-Host "Using institution slug: $institutionSlug" -ForegroundColor Yellow
}

if ($institutionId) {
  Write-Step "6. Institution Profile"
  $profile = Invoke-Api -Path "/api/institutions/$institutionId"
  Show-Result "Institution profile:" $profile

  Write-Step "7. Institution Nested Data"
  $endpoints = @(
    "/api/institutions/$institutionId/faculties",
    "/api/institutions/$institutionId/programs",
    "/api/institutions/$institutionId/admissions",
    "/api/institutions/$institutionId/tuition",
    "/api/institutions/$institutionId/scholarships",
    "/api/institutions/$institutionId/facilities",
    "/api/institutions/$institutionId/reviews",
    "/api/institutions/$institutionId/resources"
  )

  foreach ($ep in $endpoints) {
    Write-Host "`nGET $ep" -ForegroundColor DarkGray
    $result = Invoke-Api -Path $ep
    Show-Result "Response:" $result
  }
}

# --------------------------------------------------
# 8. SEARCH
# --------------------------------------------------
Write-Step "8. Unified Search"
$search = Invoke-Api -Path "/api/search?q=university"
Show-Result "Search results:" $search

# --------------------------------------------------
# 9. RESOURCES
# --------------------------------------------------
Write-Step "9. Resources List"
$resources = Invoke-Api -Path "/api/resources?page=1&limit=5"
Show-Result "Resources:" $resources

# --------------------------------------------------
# 10. RESEARCH
# --------------------------------------------------
Write-Step "10. Research List"
$research = Invoke-Api -Path "/api/research?page=1&limit=5"
Show-Result "Research:" $research

# --------------------------------------------------
# 11. AI HEALTH
# --------------------------------------------------
Write-Step "11. AI Subsystem Health"
try {
  $aiHealth = Invoke-Api -Path "/api/ai/health"
  Show-Result "AI health:" $aiHealth
} catch {
  Write-Host "AI health check failed. Is Ollama running?" -ForegroundColor Yellow
}

# --------------------------------------------------
# 12. AI CONSULT
# --------------------------------------------------
Write-Step "12. AI Consultation"
try {
  $aiBody = @{
    prompt = "Which universities offer Artificial Intelligence programs?"
  }
  if ($institutionId) {
    $aiBody.institution_id = $institutionId
  }

  $ai = Invoke-Api -Method POST -Path "/api/ai/consult" -Body $aiBody -Token $Token
  Show-Result "AI consult:" $ai
} catch {
  Write-Host "AI consult failed. Check Ollama + database + pgvector." -ForegroundColor Yellow
}

# --------------------------------------------------
# 13. AI SEMANTIC SEARCH
# --------------------------------------------------
Write-Step "13. AI Semantic Search"
try {
  $semantic = Invoke-Api -Path "/api/ai/search?q=admission%20requirements"
  Show-Result "Semantic search:" $semantic
} catch {
  Write-Host "Semantic search failed." -ForegroundColor Yellow
}

# --------------------------------------------------
# 14. NEGATIVE AUTH TEST
# --------------------------------------------------
Write-Step "14. Negative Auth Test (expect 401)"
try {
  Invoke-Api -Path "/api/auth/me" -Token "invalid.token.value"
  Write-Host "Unexpected success with invalid token" -ForegroundColor Red
} catch {
  Write-Host "Expected failure with invalid token." -ForegroundColor Green
}

Write-Host ""
Write-Host "Manual API test run completed." -ForegroundColor Green
