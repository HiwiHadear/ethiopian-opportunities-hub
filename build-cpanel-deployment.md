# cPanel Deployment Guide for gezashekalo.rundagbusiness.com

## 🚨 Current Issue: Site Not Accessible
Your subdomain `gezashekalo.rundagbusiness.com` is not loading, indicating a configuration problem.

## ✅ Step-by-Step Fix

### 1. Check Subdomain Configuration
- Login to your cPanel
- Go to **Subdomains** section
- Ensure `gezashekalo` subdomain is created and points to correct directory
- Document Root should be something like: `/public_html/gezashekalo/`

### 2. Verify File Structure
In your subdomain's directory, you should see:
```
/public_html/gezashekalo/
├── index.html          ← MUST be here (not in a subfolder)
├── .htaccess          ← Required for React Router
├── assets/            ← CSS, JS, images
├── robots.txt
└── favicon.ico
```

### 3. Common Mistakes to Avoid
❌ **WRONG**: Uploading the `dist` folder itself
```
/public_html/gezashekalo/
└── dist/
    ├── index.html
    └── assets/
```

✅ **CORRECT**: Uploading the CONTENTS of dist folder
```
/public_html/gezashekalo/
├── index.html
├── .htaccess
└── assets/
```

### 4. Required .htaccess File
Create this file in your subdomain root:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

### 5. File Permissions
Set correct permissions:
- Files: 644
- Folders: 755
- .htaccess: 644

## 🛠️ Quick Fix Commands
If you have SSH access:
```bash
cd /public_html/gezashekalo/
chmod 644 *.html *.txt .htaccess
chmod -R 755 assets/
```

## 🔍 Troubleshooting Checklist
1. ✅ Subdomain created in cPanel
2. ✅ Files in correct directory (not in a subfolder)
3. ✅ index.html at root level
4. ✅ .htaccess file present
5. ✅ Correct file permissions
6. ✅ DNS propagated (can take 24-48 hours)

## 🆘 Still Not Working?
1. Check cPanel Error Logs
2. Verify subdomain DNS settings
3. Contact your hosting provider
4. Ensure mod_rewrite is enabled

---
Generated: ${new Date().toISOString()}