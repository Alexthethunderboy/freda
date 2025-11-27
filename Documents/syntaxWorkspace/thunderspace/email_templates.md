# UnlearnNaija Communication Protocols

Use these templates in your Supabase Dashboard under **Authentication > Email Templates**.

## 1. Confirm Your Signup
**Subject:** `[Action Required] Confirm your Scholar Identity`

**Body:**
```html
<div style="font-family: 'Courier New', monospace; background-color: #000; color: #fff; padding: 40px; text-align: center; border: 1px solid #333;">
  <h2 style="text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 30px;">Identity Verification</h2>
  
  <p style="font-size: 14px; line-height: 1.6; color: #ccc; margin-bottom: 30px;">
    Greetings. You have initiated the protocol to join <strong>UnlearnNaija</strong>.
    To activate your dossier and gain access to the archives, verification of this communication channel is required.
  </p>

  <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #fff; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 30px; border: 1px solid #fff;">
    Confirm Identity
  </a>

  <p style="font-size: 10px; color: #666; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
    SYSTEM MESSAGE: If you did not request this access, disregard this transmission.
    <br>UNLEARNNAIJA // THE THUNDER ARCHIVE
  </p>
</div>
```

---

## 2. Reset Password
**Subject:** `[Security Alert] Recovery Protocol Initiated`

**Body:**
```html
<div style="font-family: 'Courier New', monospace; background-color: #000; color: #fff; padding: 40px; text-align: center; border: 1px solid #333;">
  <h2 style="text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 30px;">Access Recovery</h2>
  
  <p style="font-size: 14px; line-height: 1.6; color: #ccc; margin-bottom: 30px;">
    A request to reset the access credentials for your dossier has been received.
    Proceed via the secure link below to restore your connection.
  </p>

  <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #fff; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 30px; border: 1px solid #fff;">
    Reset Credentials
  </a>

  <p style="font-size: 10px; color: #666; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
    SYSTEM MESSAGE: This link will expire shortly. If this was not you, secure your perimeter immediately.
    <br>UNLEARNNAIJA // THE THUNDER ARCHIVE
  </p>
</div>
```

---

## 3. Magic Link
**Subject:** `[Direct Access] Secure Login Link`

**Body:**
```html
<div style="font-family: 'Courier New', monospace; background-color: #000; color: #fff; padding: 40px; text-align: center; border: 1px solid #333;">
  <h2 style="text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 30px;">Direct Access</h2>
  
  <p style="font-size: 14px; line-height: 1.6; color: #ccc; margin-bottom: 30px;">
    Use this secure token to bypass standard authentication protocols and enter the archive directly.
  </p>

  <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #fff; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 30px; border: 1px solid #fff;">
    Enter Archive
  </a>

  <p style="font-size: 10px; color: #666; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
    SYSTEM MESSAGE: Do not share this link. It is your personal key.
    <br>UNLEARNNAIJA // THE THUNDER ARCHIVE
  </p>
</div>
```

---

## 4. Invite User
**Subject:** `[Invitation] You have been summoned to the Archive`

**Body:**
```html
<div style="font-family: 'Courier New', monospace; background-color: #000; color: #fff; padding: 40px; text-align: center; border: 1px solid #333;">
  <h2 style="text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 30px;">Scholar Invitation</h2>
  
  <p style="font-size: 14px; line-height: 1.6; color: #ccc; margin-bottom: 30px;">
    You have been invited to join <strong>UnlearnNaija</strong>.
    Accept this summons to begin your contribution to the digital archive.
  </p>

  <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #fff; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 30px; border: 1px solid #fff;">
    Accept Invitation
  </a>

  <p style="font-size: 10px; color: #666; margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
    SYSTEM MESSAGE: Welcome to the fold.
    <br>UNLEARNNAIJA // THE THUNDER ARCHIVE
  </p>
</div>
```
