# LeadPilot Multi-Tenant CRM Security Specification

## 1. Data Invariants

1. **Strict Tenant Isolation**: A user belonging to Tenant A (e.g. `dental-demo`) MUST NEVER read, update, list, or delete leads from Tenant B (e.g. `hvac-pro`).
2. **Master Gate Enforcement**: Access to `/tenants/{tenantId}/leads/{leadId}` is gated by membership in `/tenants/{tenantId}/members/{request.auth.uid}` or `/users/{request.auth.uid}.tenantId == tenantId`.
3. **No Blanket Reads**: Anonymous and unauthenticated requests are strictly denied all read and list operations on `/tenants/{tenantId}/leads`.
4. **Public Landing Capture Isolation (Write-Only)**: The public landing page may create an enquiry at `/tenants/{tenantId}/leads/{leadId}` with validated fields and matching `clientId == tenantId`, but has ZERO read permissions (`allow read: if false` for non-members).
5. **No Self-Privilege Escalation**: Users cannot self-assign the `admin` role in their user profile documents during registration or update.
6. **Immutable Identity and Tenant Binding**: Once a lead or user record is created, its `clientId` / `tenantId` and `id` cannot be modified by any client update.
7. **Input Validation**: All string fields and IDs must be validated against type and size constraints (`isValidId`, `isValidLead`) to prevent Denial of Wallet and injection attacks.

---

## 2. The "Dirty Dozen" Payloads (Red Team Exploit Vectors)

1. **Payload 1: Unauthenticated Read/List (`GET /tenants/dental-demo/leads`)**
   - *Attempt*: Unauthenticated HTTP/SDK client queries all leads of `dental-demo`.
   - *Expected*: `PERMISSION_DENIED`.

2. **Payload 2: Cross-Tenant Lead Read (`GET /tenants/hvac-pro/leads/LP-001` by `user_dental`)**
   - *Attempt*: Authenticated user belonging to `dental-demo` tries to read `LP-001` belonging to `hvac-pro`.
   - *Expected*: `PERMISSION_DENIED`.

3. **Payload 3: Cross-Tenant Lead List (`LIST /tenants/hvac-pro/leads` by `user_dental`)**
   - *Attempt*: User belonging to `dental-demo` issues a list query for `/tenants/hvac-pro/leads`.
   - *Expected*: `PERMISSION_DENIED`.

4. **Payload 4: Tenant ID Spoofing in Write (`CREATE /tenants/hvac-pro/leads/LP-002` with `clientId: dental-demo`)**
   - *Attempt*: Injected payload where document path is in `hvac-pro` but internal `clientId` is spoofed to another tenant or mismatched.
   - *Expected*: `PERMISSION_DENIED`.

5. **Payload 5: Privilege Escalation on Profile Creation (`CREATE /users/{uid}` with `role: "admin"`)**
   - *Attempt*: Newly registered user attempts to set `role: "admin"` directly in `/users/{uid}`.
   - *Expected*: `PERMISSION_DENIED` (only `staff` / `owner` allowed during unverified creation; `admin` requires existing admin doc).

6. **Payload 6: Role Escalation on Profile Update (`UPDATE /users/{uid}` modifying `role` or `tenantId`)**
   - *Attempt*: User attempts to switch their `tenantId` to an arbitrary victim tenant or escalate their `role`.
   - *Expected*: `PERMISSION_DENIED`.

7. **Payload 7: Cross-Tenant Lead Update (`UPDATE /tenants/physio-clinic/leads/LP-003` by `user_hvac`)**
   - *Attempt*: User authenticated to `hvac-pro` attempts to change status or notes of `LP-003` in `physio-clinic`.
   - *Expected*: `PERMISSION_DENIED`.

8. **Payload 8: Cross-Tenant Lead Deletion (`DELETE /tenants/real-estate/leads/LP-004` by `user_dental`)**
   - *Attempt*: User attempts to delete a competitor's lead.
   - *Expected*: `PERMISSION_DENIED`.

9. **Payload 9: Denial-of-Wallet Payload Injection (1MB oversized payload)**
   - *Attempt*: Public form submitter submits a 2MB string in `details` or `name`.
   - *Expected*: `PERMISSION_DENIED` via strict `.size() <= 1000` validation.

10. **Payload 10: Path Variable Poisoning (`/tenants/../leads` or malformed ID characters)**
    - *Attempt*: Path injection using non-alphanumeric special characters.
    - *Expected*: `PERMISSION_DENIED` via `isValidId()`.

11. **Payload 11: Landing Page Public Record Snooping (`GET /tenants/dental-demo/leads/LP-001`)**
    - *Attempt*: Public visitor submits lead, then attempts to fetch or inspect other leads from the browser.
    - *Expected*: `PERMISSION_DENIED`.

12. **Payload 12: Lead ID & Tenant ID Immutability Tampering (`UPDATE LP-001` changing `id` or `clientId`)**
    - *Attempt*: Authenticated member attempts to re-assign an existing lead's `clientId` to another tenant.
    - *Expected*: `PERMISSION_DENIED`.
