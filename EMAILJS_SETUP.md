# EmailJS Setup Guide

This guide will walk you through setting up EmailJS for the iBOK application.

## 📧 Step 1: Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Click "Sign Up" (it's free for up to 200 emails/month)
3. Verify your email address
4. Log in to your dashboard

## 🔧 Step 2: Add Email Service

1. In the EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - Outlook
   - Yahoo
   - Custom SMTP
4. Follow the provider-specific setup:

### For Gmail:
1. Select "Gmail"
2. Click "Connect Account"
3. Sign in with your Google account
4. Allow EmailJS to send emails on your behalf
5. Give your service a name (e.g., "iBOK Notifications")
6. Copy the **Service ID** (e.g., `service_abc123`)

## 📝 Step 3: Create Email Templates

### Template 1: Login Notification

1. Click "Email Templates" in the sidebar
2. Click "Create New Template"
3. Configure the template:

**Template Name:** `iBOK Login Notification`

**Subject:**
```
New Login Detected - iBOK
```

**Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E84545; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .info-row { margin: 10px 0; padding: 10px; background: white; border-left: 3px solid #E84545; }
        .label { font-weight: bold; color: #E84545; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 New Login Detected</h1>
        </div>
        <div class="content">
            <p>A new login has been detected on the iBOK Internet Banking system.</p>
            
            <div class="info-row">
                <span class="label">User Email:</span> {{user_email}}
            </div>
            
            <div class="info-row">
                <span class="label">Account Number:</span> {{account_number}}
            </div>
            
            <div class="info-row">
                <span class="label">Login Time:</span> {{timestamp}}
            </div>
            
            <div class="info-row">
                <span class="label">IP Address:</span> {{ip_address}}
            </div>
            
            <div class="info-row">
                <span class="label">User Agent:</span> {{user_agent}}
            </div>
            
            <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 3px solid #ffc107;">
                ⚠️ If this wasn't you, please contact security immediately.
            </p>
        </div>
        <div class="footer">
            <p>iBOK Internet Banking Services</p>
            <p>This is an automated notification. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
```

**To Email:** `{{to_email}}`

4. Click "Save"
5. Copy the **Template ID** (e.g., `template_xyz789`)

### Template 2: Profile Update Notification

1. Click "Create New Template" again
2. Configure the template:

**Template Name:** `iBOK Profile Update`

**Subject:**
```
Profile Updated - iBOK
```

**Content:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #E84545; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .info-row { margin: 10px 0; padding: 10px; background: white; border-left: 3px solid #E84545; }
        .label { font-weight: bold; color: #E84545; }
        .changes { background: white; padding: 15px; margin: 15px 0; border: 1px solid #ddd; }
        .change-item { padding: 8px; margin: 5px 0; background: #f0f0f0; border-radius: 4px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 Profile Updated</h1>
        </div>
        <div class="content">
            <p>A user profile has been updated on the iBOK Internet Banking system.</p>
            
            <div class="info-row">
                <span class="label">User Email:</span> {{user_email}}
            </div>
            
            <div class="info-row">
                <span class="label">Account Number:</span> {{account_number}}
            </div>
            
            <div class="info-row">
                <span class="label">Update Time:</span> {{timestamp}}
            </div>
            
            <div class="info-row">
                <span class="label">Total Changes:</span> {{total_changes}}
            </div>
            
            <div class="changes">
                <h3 style="color: #E84545; margin-top: 0;">Changes Made:</h3>
                <pre style="white-space: pre-wrap; font-family: monospace; background: #f9f9f9; padding: 10px; border-radius: 4px;">{{changes_list}}</pre>
            </div>
            
            <p style="margin-top: 20px; padding: 15px; background: #d1ecf1; border-left: 3px solid #0c5460;">
                ℹ️ This is an automated notification for profile changes.
            </p>
        </div>
        <div class="footer">
            <p>iBOK Internet Banking Services</p>
            <p>This is an automated notification. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
```

**To Email:** `{{to_email}}`

3. Click "Save"
4. Copy the **Template ID** (e.g., `template_abc456`)

## 🔑 Step 4: Get Your Public Key

1. Click on "Account" in the sidebar
2. Scroll to "API Keys" section
3. Copy your **Public Key** (e.g., `user_xyz123abc`)

## ⚙️ Step 5: Configure Environment Variables

1. Open the `.env` file in your project
2. Replace the placeholder values:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID_LOGIN=template_xyz789
VITE_EMAILJS_TEMPLATE_ID_UPDATE=template_abc456
VITE_EMAILJS_PUBLIC_KEY=user_xyz123abc

# Admin Email (where notifications will be sent)
VITE_ADMIN_EMAIL=your-admin-email@example.com

# Security Configuration (optional - defaults are fine)
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOCKOUT_DURATION=300000
VITE_SESSION_TIMEOUT=1800000
```

3. Save the file

## ✅ Step 6: Test the Integration

### Test Login Notification:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Log in with any valid credentials:
   - Account: `1234567` (7+ digits)
   - Password: `Password@123` (meets requirements)

4. Check your admin email inbox
5. You should receive a "New Login Detected" email

### Test Profile Update Notification:

1. After logging in, you'll be on the profile page
2. Change any field (e.g., phone number)
3. Click "تحديث البيانات" (Update Data)
4. Check your admin email inbox
5. You should receive a "Profile Updated" email with the changes

## 🐛 Troubleshooting

### Email not received?

1. **Check spam folder** - EmailJS emails might be marked as spam initially
2. **Verify service is active** - Go to EmailJS dashboard > Email Services
3. **Check template IDs** - Make sure they match in `.env`
4. **Check browser console** - Look for error messages
5. **Verify email limit** - Free plan has 200 emails/month
6. **Check rate limiting** - App limits to 5 emails/hour per user

### Common Errors:

**Error: "Service ID is invalid"**
- Solution: Double-check `VITE_EMAILJS_SERVICE_ID` in `.env`

**Error: "Template ID is invalid"**
- Solution: Verify `VITE_EMAILJS_TEMPLATE_ID_LOGIN` and `VITE_EMAILJS_TEMPLATE_ID_UPDATE`

**Error: "Public key is invalid"**
- Solution: Check `VITE_EMAILJS_PUBLIC_KEY` in `.env`

**Error: "Rate limit exceeded"**
- Solution: Wait 1 hour or clear browser localStorage

**Error: "Failed to send email"**
- Solution: Check internet connection and EmailJS service status

## 📊 EmailJS Dashboard Features

### Monitor Email Sends:
1. Go to "Email History" in dashboard
2. See all sent emails
3. Check delivery status
4. View error logs

### Usage Limits:
- **Free Plan:** 200 emails/month
- **Personal Plan:** 1,000 emails/month ($9/month)
- **Professional Plan:** 10,000 emails/month ($35/month)

### Best Practices:
1. Don't share your private keys
2. Use environment variables
3. Implement rate limiting (already done)
4. Monitor your usage
5. Test templates before production
6. Keep templates simple and responsive

## 🔒 Security Notes

### What's Exposed:
- ✅ Public Key (safe to expose)
- ✅ Service ID (safe to expose)
- ✅ Template IDs (safe to expose)

### What's Protected:
- ❌ Private Key (never expose - not used in frontend)
- ❌ Email service credentials (stored on EmailJS servers)
- ❌ Admin email (in environment variables)

### Rate Limiting:
The app implements rate limiting to prevent abuse:
- Maximum 5 emails per user per hour
- Tracked in browser memory
- Resets after 1 hour

## 📞 Support

### EmailJS Support:
- Documentation: https://www.emailjs.com/docs/
- Support: support@emailjs.com
- Status: https://status.emailjs.com/

### App Support:
- Check `README.md` for general help
- Check `SECURITY.md` for security info
- Check browser console for errors

## ✨ Advanced Configuration

### Custom Email Service (SMTP):

1. Click "Add New Service"
2. Select "Custom SMTP"
3. Enter your SMTP details:
   - Host: `smtp.example.com`
   - Port: `587` or `465`
   - Username: Your email
   - Password: Your password
4. Test the connection
5. Save and copy Service ID

### Multiple Admin Emails:

To send to multiple admins, modify the template:

**To Email:** `admin1@example.com,admin2@example.com,admin3@example.com`

### Custom Email Content:

You can customize the email templates with:
- Your company logo
- Custom colors
- Additional information
- Different languages

---

**Setup Complete! 🎉**

Your EmailJS integration is now ready. Test it thoroughly before deploying to production.
