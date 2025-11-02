# Contact Form Setup Instructions

## Current Status

The contact form on `/contact.html` is configured to use **Formspree**, a free service that forwards form submissions to your email.

## Setup Required

To activate the contact form, you need to:

### 1. Create a Formspree Account

1. Go to https://formspree.io/
2. Sign up for a free account (allows 50 submissions/month)
3. Verify your email address

### 2. Create a New Form

1. Click "New Form" in your Formspree dashboard
2. Name it: "Socket23 Contact Form"
3. Set the email to: `Millerjo4582@gmail.com`
4. Copy the form endpoint (looks like: `https://formspree.io/f/xxxxxxxx`)

### 3. Update contact.html

Replace the form action in `static-site/site/contact.html`:

```html
<!-- Current placeholder -->
<form action="https://formspree.io/f/mnqeqpvg" method="POST" id="contactForm">

<!-- Replace with your actual endpoint -->
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" id="contactForm">
```

### 4. Deploy the Updated Site

```bash
cd ~/site-infrastructure/static-site
git pull origin master
docker build -t ghcr.io/socket23/static-site:latest .
docker service update --image ghcr.io/socket23/static-site:latest web_web
```

## Alternative: Formsubmit.co (No Signup Required)

If you prefer not to create a Formspree account, you can use Formsubmit.co:

1. Update the form action in `contact.html`:
   ```html
   <form action="https://formsubmit.co/Millerjo4582@gmail.com" method="POST">
   ```

2. Add these hidden fields to customize behavior:
   ```html
   <input type="hidden" name="_subject" value="New contact from Socket23">
   <input type="hidden" name="_captcha" value="false">
   <input type="text" name="_honey" style="display:none">
   <input type="hidden" name="_next" value="https://socket23.com/contact.html?success=true">
   ```

3. On first submission, you'll receive a confirmation email to activate the form

## Features

Both services provide:
- ✅ Spam protection
- ✅ Email notifications
- ✅ No backend code required
- ✅ Works with static sites
- ✅ Free tier available

## Current Form Fields

- Name (required)
- Email (required)
- Subject (required)
- Message (required)

## Testing

After setup:
1. Visit https://socket23.com/contact.html
2. Fill out the form
3. Submit
4. Check your email at Millerjo4582@gmail.com

## Security Note

The form uses POST method and includes basic spam protection. Consider adding:
- reCAPTCHA for additional spam protection
- Rate limiting (Formspree includes this)
- Honeypot fields (already included in Formsubmit example)

