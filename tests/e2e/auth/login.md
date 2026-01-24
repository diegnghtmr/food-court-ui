### E2E Tests: Authentication

**Suite ID:** `AUTH-E2E`
**Feature:** User Authentication

---

## Test Case: `AUTH-001` - Admin Login Success

**Priority:** `critical`

**Tags:**
- type → @e2e
- feature → @auth

**Description/Objective:** Verify that an administrator can log in with valid credentials and access the admin dashboard.

**Preconditions:**
- Backend services are running.
- Admin user "admin@food.test" exists in the database.

### Flow Steps:
1. Navigate to /login
2. Enter valid email "admin@food.test"
3. Enter valid password "Admin123!"
4. Click "Iniciar Sesión" button

### Expected Result:
- Redirect to /admin/dashboard
- "Panel Admin" sidebar is visible

### Key verification points:
- URL matches /admin/dashboard
- Heading "Panel Admin" is visible

### Notes:
- Uses `admin@food.test` seed data.
