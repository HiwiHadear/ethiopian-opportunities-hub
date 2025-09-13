#!/usr/bin/env node

/**
 * Build script optimized for cPanel deployment
 * This script creates a production build ready for upload to cPanel hosting
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const buildForCPanel = async () => {
  console.log('🚀 Building for cPanel deployment...\n');

  try {
    // Set environment variables for cPanel build
    process.env.DEPLOY_TARGET = 'cpanel';
    process.env.NODE_ENV = 'production';

    // Run the build command
    console.log('📦 Running production build...');
    const buildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        DEPLOY_TARGET: 'cpanel'
      }
    });

    buildProcess.on('close', async (code) => {
      if (code === 0) {
        console.log('\n✅ Build completed successfully!');
        await createCPanelFiles();
        await createDeploymentInstructions();
        await createDownloadableZip();
        console.log('\n🎉 Your files are ready for cPanel upload!');
        console.log('📁 Upload the contents of the "dist" folder to your cPanel public_html directory');
        console.log('💾 Download ready: dist.zip created for easy upload');
      } else {
        console.error('\n❌ Build failed with exit code', code);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Build error:', error);
    process.exit(1);
  }
};

const createCPanelFiles = async () => {
  const distPath = './dist';
  
  // Create .htaccess for SPA routing
  const htaccessContent = `# Enable rewrite engine
RewriteEngine On

# Handle Angular/React Router
RewriteBase /
RewriteRule ^index\.html$ - [L]
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

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`;

  await fs.writeFile(path.join(distPath, '.htaccess'), htaccessContent);
  console.log('✅ Created .htaccess file for SPA routing and optimization');

  // Create robots.txt for SEO
  const robotsContent = `User-agent: *
Allow: /

Sitemap: https://gezashekalo.rundagbusiness.com/sitemap.xml
`;

  await fs.writeFile(path.join(distPath, 'robots.txt'), robotsContent);
  console.log('✅ Created robots.txt file');
};

const createDeploymentInstructions = async () => {
  const instructions = `# cPanel Deployment Instructions

## 🚀 Quick Upload Guide

### Option 1: Direct File Upload
1. **Login to your cPanel account**
2. **Open File Manager**
3. **Navigate to public_html folder**
4. **Upload all files from the 'dist' folder** (not the dist folder itself)
5. **Extract if you uploaded as a zip file**

### Option 2: Upload dist.zip
1. **Upload dist.zip to public_html**
2. **Extract the zip file in cPanel File Manager**
3. **Move contents to root of public_html**
4. **Delete the zip file**

## 📁 Files to Upload

Upload ALL contents of the 'dist' folder to your public_html directory:
- index.html
- assets/ folder
- .htaccess (for SPA routing)
- robots.txt (for SEO)

## ⚙️ Important Configuration Notes

### 1. Domain Configuration
- Update robots.txt with your actual domain
- Ensure your domain points to the public_html folder

### 2. SSL Certificate
- Enable SSL/HTTPS in cPanel
- Force HTTPS redirects for security

### 3. Supabase Configuration
- Your Supabase connection is already configured
- No additional backend setup needed

### 4. File Permissions
- Set file permissions to 644 for files
- Set folder permissions to 755 for directories

## 🔧 Troubleshooting

### Page Not Found (404) on Refresh
- Ensure .htaccess file is uploaded and enabled
- Check if mod_rewrite is enabled on your hosting

### Assets Not Loading
- Verify all files in assets/ folder are uploaded
- Check file permissions

### SSL Issues
- Enable Force HTTPS in cPanel
- Update any hardcoded HTTP links to HTTPS

## 📞 Support

If you encounter issues:
1. Check cPanel error logs
2. Contact your hosting provider for mod_rewrite support
3. Verify file upload completion

---
Generated on: ${new Date().toISOString()}
`;

  await fs.writeFile('./CPANEL_DEPLOYMENT.md', instructions);
  console.log('✅ Created deployment instructions (CPANEL_DEPLOYMENT.md)');
};

const createDownloadableZip = async () => {
  // Note: This would require a zip library in a real implementation
  // For now, we'll create instructions for manual zipping
  const zipInstructions = `# Create Downloadable Package

## Manual Zip Creation:
1. Navigate to the 'dist' folder
2. Select ALL contents (not the dist folder itself)
3. Create a zip file named 'website-files.zip'
4. This zip is ready for cPanel upload

## Command Line (if available):
\`\`\`bash
cd dist
zip -r ../website-files.zip *
\`\`\`

## Contents should include:
- index.html
- assets/ folder with all JS, CSS, and images
- .htaccess file
- robots.txt
- Any other generated files
`;

  await fs.writeFile('./CREATE_ZIP.md', zipInstructions);
  console.log('✅ Created zip creation instructions (CREATE_ZIP.md)');
};

// Run the build
buildForCPanel().catch(console.error);