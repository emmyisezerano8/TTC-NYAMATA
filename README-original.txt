TTC NYAMATA ADMIN WEBSITE

Files:
- index.html       Public TTC NYAMATA website
- admin.html       Administrator login/dashboard
- admin.css        Admin dashboard styling
- admin.js         Admin CRUD + inbox logic

Demo administrator:
Username: admin
Password: Admin@123

WHAT WORKS:
- Admin login/session
- Create/edit/delete news
- Create/edit/delete events
- Contact form stores messages in browser localStorage
- Admin can read, mark read/unread, delete and prepare replies
- "Open Email App" uses mailto: to open the administrator's email client
- Public website reads news/events from the same browser localStorage

IMPORTANT:
This is a frontend/localStorage administrator system. It is NOT secure for a real public website because localStorage is browser-specific and users can inspect/change it.

FOR A REAL PRODUCTION ADMIN:
Use a backend with:
- secure server-side authentication
- password hashing (bcrypt/argon2)
- role-based access control
- database (MySQL/PostgreSQL/MongoDB)
- API endpoints for news/events/messages
- server-side email sending (SMTP/Resend/SendGrid/etc.)
- HTTPS, CSRF protection, rate limiting and audit logs

The current frontend is structured so the localStorage functions can later be replaced with API calls.
