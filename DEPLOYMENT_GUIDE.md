# Deployment Guide - New Professional Site

## 🎉 Your New Site is Ready!

All changes have been committed and pushed to GitHub:
- **Commit**: `63eb33d`
- **Repository**: https://github.com/socket23/site-infrastructure

---

## 📋 Quick Deployment Steps

### On Your Odroid (192.168.7.11)

```bash
# 1. Navigate to the repository
cd ~/site-infrastructure

# 2. Pull the latest changes
git pull origin master

# 3. Build the new image
cd static-site
docker build -t ghcr.io/socket23/static-site:latest .

# 4. Update the running service
docker service update --image ghcr.io/socket23/static-site:latest web_web

# 5. Watch the deployment
docker service ps web_web

# 6. Check logs
docker service logs -f web_web
# Press Ctrl+C to exit logs

# 7. Test locally
curl -I http://localhost:8080/
curl http://localhost:8080/about.html
curl http://localhost:8080/projects.html
curl http://localhost:8080/contact.html
```

---

## ✅ Verification Checklist

After deployment, test these URLs:

### From the Odroid (local):
- [ ] `curl http://localhost:8080/` - Services page
- [ ] `curl http://localhost:8080/about.html` - About page
- [ ] `curl http://localhost:8080/projects.html` - Projects page
- [ ] `curl http://localhost:8080/contact.html` - Contact page
- [ ] `curl http://localhost:8080/404.html` - 404 page

### From your browser (external):
- [ ] https://socket23.com/ - Services page
- [ ] https://socket23.com/about.html - About page
- [ ] https://socket23.com/projects.html - Projects page
- [ ] https://socket23.com/contact.html - Contact page
- [ ] https://socket23.com/test404 - Should show 404 page

---

## 🔧 Contact Form Setup (Required)

The contact form won't work until you activate it. Choose one option:

### Option 1: Formspree (Recommended - More Features)

1. **Sign up**: https://formspree.io/
2. **Create form**: 
   - Name: "Socket23 Contact Form"
   - Email: Millerjo4582@gmail.com
3. **Copy form ID** (looks like: `mnqeqpvg`)
4. **Update contact.html**:
   ```bash
   cd ~/site-infrastructure/static-site/site
   nano contact.html
   # Find line 72: <form action="https://formspree.io/f/mnqeqpvg"
   # Replace mnqeqpvg with your actual form ID
   ```
5. **Rebuild and deploy**:
   ```bash
   cd ~/site-infrastructure/static-site
   docker build -t ghcr.io/socket23/static-site:latest .
   docker service update --image ghcr.io/socket23/static-site:latest web_web
   ```

### Option 2: Formsubmit.co (Simpler - No Signup)

1. **Update contact.html**:
   ```bash
   cd ~/site-infrastructure/static-site/site
   nano contact.html
   # Find line 72: <form action="https://formspree.io/f/mnqeqpvg"
   # Replace with: <form action="https://formsubmit.co/Millerjo4582@gmail.com"
   ```
2. **Rebuild and deploy** (same as above)
3. **Activate**: Submit the form once, then check your email for activation link

See `CONTACT_FORM_SETUP.md` for detailed instructions.

---

## 📊 What Changed

### New Pages:
- ✨ **about.html** - Professional bio and expertise
- ✨ **projects.html** - Project showcase with GitHub links
- ✨ **contact.html** - Contact information and form

### Updated Pages:
- ✏️ **index.html** - Now the Services page
- ✏️ **404.html** - Updated with navigation
- ✏️ **styles.css** - Enhanced with hover effects

### Content:
- Your name: Joseph Miller
- Title: Security Engineer & Systems Administrator
- Location: Sandy, Oregon
- Experience: 20+ years
- Email: Millerjo4582@gmail.com
- LinkedIn and GitHub links
- 12 services listed (6 cybersecurity + 6 IT)

---

## 🎨 Design Features

- ✅ Dark theme with teal accents (unchanged)
- ✅ Responsive design (mobile-friendly)
- ✅ Consistent navigation across all pages
- ✅ Hover effects on buttons and links
- ✅ Professional layout
- ✅ Security-focused content

---

## 🔍 Troubleshooting

### Service won't update:
```bash
# Force update
docker service update --force --image ghcr.io/socket23/static-site:latest web_web

# Or remove and redeploy
docker service rm web_web
docker stack deploy -c stack.yaml web
```

### Pages show old content:
```bash
# Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
# Or check if image was rebuilt:
docker images | grep static-site
```

### Contact form not working:
- Check `CONTACT_FORM_SETUP.md`
- Verify form action URL in contact.html
- Test form submission and check email

---

## 📱 Mobile Testing

The site is fully responsive. Test on mobile:
- Navigation menu becomes hamburger (☰) on small screens
- All sections stack vertically
- Touch-friendly buttons and links

---

## 🚀 Next Steps

1. **Deploy the site** (follow steps above)
2. **Set up contact form** (choose Formspree or Formsubmit)
3. **Test all pages** (use checklist above)
4. **Share your site**:
   - Update LinkedIn with website link
   - Add to email signature
   - Share on professional networks

---

## 📞 Need Help?

If you run into issues:
1. Check service logs: `docker service logs web_web`
2. Verify service status: `docker service ps web_web`
3. Test locally first: `curl http://localhost:8080/`
4. Check HAProxy on IPFire is forwarding correctly

---

## 🎯 Success Criteria

You'll know it's working when:
- ✅ All 4 pages load correctly
- ✅ Navigation works on all pages
- ✅ Mobile menu works (test on phone)
- ✅ Contact form submits successfully
- ✅ External access works via https://socket23.com/
- ✅ All links (LinkedIn, GitHub) work

---

**Ready to deploy? SSH into your Odroid and run the commands above!** 🚀

