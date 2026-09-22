TTC NYAMATA - FIXED FRONTEND FILES

Main fixes:
1. Added the missing Messages item to the administrator sidebar.
2. Fixed the admin.js crash caused by referencing messageBadge before it existed.
3. Changed admin news image fallback from 87.png to image.png.
4. Fixed the mobile admin sidebar CSS so navigation icons/text do not disappear.
5. Normalized the public website About link to About.html to avoid case-sensitive hosting errors.
6. Verified admin.js, index inline JavaScript, and About inline JavaScript with Node.js syntax checking.

IMPORTANT:
This is still a frontend/localStorage admin system. The administrator username/password are present in admin.js and are NOT secure for production. For a public deployment, use the Node.js + Express + database backend discussed previously.
