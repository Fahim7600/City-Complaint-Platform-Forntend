# Backend Services & API Layer

Organized service modules matching the backend API endpoints (`/api/v1`):
- `auth.service.ts`: Login, registration, Google OAuth, token refresh, logout
- `complaints.service.ts`: Grievance submission, retrieval, updates, status changes
- `services.service.ts`: Civic service requests, catalogs, and tracking
- `users.service.ts`: Profile management and role checks
- `analytics.service.ts`: Charts, SLA metrics, and complaint resolution stats
- `payments.service.ts`: Paid municipal services and fees
- `api-client.ts`: Axios instance configured with baseURL, bearer interceptors, and error handling
