# Complete Deployment Guide

## 🎯 cPanel Hosting (Recommended)

### Step 1: Build for cPanel
```bash
npm run build:cpanel
```

### Step 2: Upload Files
1. Login to your cPanel
2. Open File Manager
3. Navigate to `public_html`
4. Upload ALL contents from the `dist` folder
5. Ensure `.htaccess` file is uploaded

### Step 3: Configure Domain
- Point your domain to the `public_html` folder
- Enable SSL certificate
- Force HTTPS redirects

---

## 🚀 GitHub Pages

### Current Setup
```bash
npm run build:github
git push origin main
```
Your site will be available at: `https://yourusername.github.io/ethiopian-opportunities-hub/`

---

## 🔧 Other Hosting Platforms

### Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel
1. Import your GitHub repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

### Cloudflare Pages
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Build output directory: `dist`

---

## 🛠️ Build Configurations

### For cPanel
- Base path: `/`
- Optimized for shared hosting
- Includes `.htaccess` for SPA routing
- Browser compatibility: ES2015+

### For GitHub Pages
- Base path: `/ethiopian-opportunities-hub/`
- Optimized for GitHub's hosting

### For Other Platforms
- Base path: `/`
- Standard Vite build

---

## 🔍 Troubleshooting

### Common Issues

1. **404 on page refresh**
   - Solution: Ensure `.htaccess` is uploaded and mod_rewrite is enabled

2. **Assets not loading**
   - Solution: Check file permissions (644 for files, 755 for folders)

3. **White screen**
   - Solution: Check browser console for errors, verify all files uploaded

4. **Supabase connection issues**
   - Solution: Verify HTTPS is enabled, check CORS settings

### File Permissions
```bash
# For cPanel via SSH (if available)
find public_html/ -type f -exec chmod 644 {} \;
find public_html/ -type d -exec chmod 755 {} \;
```

---

## 📊 Performance Optimization

### Already Included:
- ✅ Asset compression
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Browser caching headers

### Additional Recommendations:
- Enable Gzip compression on server
- Use CDN for global distribution
- Monitor Core Web Vitals
- Implement lazy loading for images

---

## 🔐 Security Features

### Implemented:
- ✅ Content Security Policy headers
- ✅ XSS protection
- ✅ Clickjacking prevention
- ✅ MIME type sniffing protection

### Recommendations:
- Enable HTTPS (SSL certificate)
- Regular security updates
- Monitor for vulnerabilities
- Backup your site regularly

---

Generated on: ${new Date().toISOString()}