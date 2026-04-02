<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your OTP Code</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #0e0e12;
      font-family: 'DM Sans', sans-serif;
      color: #e8e6e0;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      width: 100%;
      padding: 48px 16px;
      background-color: #0e0e12;
    }

    .container {
      max-width: 560px;
      margin: 0 auto;
      background: #16161d;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #2a2a36;
    }

    /* ── Header ── */
    .header {
      background: linear-gradient(135deg, #1a1a24 0%, #111118 100%);
      padding: 40px 48px 32px;
      border-bottom: 1px solid #2a2a36;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: -60px;
      right: -60px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(200, 168, 100, 0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    .logo-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 28px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: #c8a864;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon svg {
      width: 18px;
      height: 18px;
      fill: #0e0e12;
    }

    .logo-name {
      font-family: 'DM Serif Display', serif;
      font-size: 18px;
      color: #e8e6e0;
      letter-spacing: 0.02em;
    }

    .header-label {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #c8a864;
      margin-bottom: 10px;
    }

    .header-title {
      font-family: 'DM Serif Display', serif;
      font-size: 30px;
      color: #f0ede6;
      line-height: 1.2;
      font-style: italic;
    }

    /* ── Body ── */
    .body {
      padding: 40px 48px;
    }

    .greeting {
      font-size: 15px;
      color: #9e9b94;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .greeting strong {
      color: #e8e6e0;
      font-weight: 500;
    }

    /* ── OTP Block ── */
    .otp-wrapper {
      margin: 32px 0;
    }

    .otp-label {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #6b6860;
      margin-bottom: 12px;
    }

    .otp-box {
      background: #0e0e12;
      border: 1px solid #2e2e3a;
      border-radius: 4px;
      padding: 28px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .otp-code {
      font-family: 'DM Mono', monospace;
      font-size: 38px;
      font-weight: 500;
      letter-spacing: 0.22em;
      color: #c8a864;
      line-height: 1;
    }

    .otp-divider {
      width: 1px;
      height: 40px;
      background: #2a2a36;
      flex-shrink: 0;
    }

    .otp-expiry {
      text-align: right;
    }

    .otp-expiry-num {
      font-family: 'DM Mono', monospace;
      font-size: 22px;
      font-weight: 500;
      color: #e8e6e0;
      line-height: 1;
    }

    .otp-expiry-label {
      font-size: 11px;
      color: #6b6860;
      letter-spacing: 0.06em;
      margin-top: 4px;
    }

    /* ── Steps ── */
    .steps {
      margin: 28px 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .step-num {
      width: 22px;
      height: 22px;
      background: #1e1e28;
      border: 1px solid #2e2e3a;
      border-radius: 50%;
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      color: #c8a864;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .step-text {
      font-size: 14px;
      color: #9e9b94;
      line-height: 1.6;
    }

    .step-text strong {
      color: #e8e6e0;
      font-weight: 500;
    }

    /* ── Warning ── */
    .warning {
      background: rgba(200, 80, 60, 0.07);
      border: 1px solid rgba(200, 80, 60, 0.2);
      border-left: 3px solid #c8503c;
      border-radius: 4px;
      padding: 14px 18px;
      margin-top: 28px;
    }

    .warning p {
      font-size: 13px;
      color: #b87a72;
      line-height: 1.5;
    }

    .warning p strong {
      color: #d9897e;
      font-weight: 500;
    }

    /* ── Footer ── */
    .footer {
      padding: 24px 48px 32px;
      border-top: 1px solid #1e1e28;
    }

    .footer-text {
      font-size: 12px;
      color: #4a4a54;
      line-height: 1.7;
      margin-bottom: 16px;
    }

    .footer-text a {
      color: #6b6860;
      text-decoration: none;
      border-bottom: 1px solid #3a3a44;
    }

    .footer-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid #1e1e28;
    }

    .footer-brand {
      font-family: 'DM Serif Display', serif;
      font-size: 13px;
      color: #3a3a44;
      letter-spacing: 0.04em;
    }

    .footer-copy {
      font-size: 11px;
      color: #3a3a44;
    }
  </style>
</head>
<body>

<div class="wrapper">
  <div class="container">

    <!-- Header -->
    <div class="header">
      <div class="logo-row">
        <div class="logo-icon">
          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2a6 6 0 0 1 6 6c0 4-6 10-6 10S4 12 4 8a6 6 0 0 1 6-6zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
          </svg>
        </div>
        <span class="logo-name">{{ config('app.name') }}</span>
      </div>
      <div class="header-label">Security Code</div>
      <div class="header-title">Verify your identity</div>
    </div>

    <!-- Body -->
    <div class="body">

      <p class="greeting">
        Hello, <strong>{{ $user->name ?? 'there' }}</strong> —<br>
        We received a request to verify your account. Use the one-time code below to continue.
      </p>

      <!-- OTP Box -->
      <div class="otp-wrapper">
        <div class="otp-label">Your one-time passcode</div>
        <div class="otp-box">
          <div class="otp-code">{{ session('otp')}}</div>
          <div class="otp-divider"></div>
          <div class="otp-expiry">
            <div class="otp-expiry-num">{{ $expires_in ?? 10 }}</div>
            <div class="otp-expiry-label">min left</div>
          </div>
        </div>
      </div>

      <!-- Steps -->
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text">Return to the <strong>{{ config('app.name') }}</strong> page where the code was requested.</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text">Enter the <strong>6-digit code</strong> exactly as shown above.</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text">The code expires in <strong>{{ $expires_in ?? 10 }} minutes</strong>. Request a new one if it has lapsed.</div>
        </div>
      </div>

      <!-- Warning -->
      <div class="warning">
        <p><strong>Did not request this?</strong> Ignore this email — your account is safe. If you keep receiving unsolicited codes, please contact support immediately.</p>
      </div>

    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        This is an automated message from {{ config('app.name') }}. Please do not reply directly to this email.
        If you need help, contact us at <a href="mailto:{{ config('mail.support_address', 'support@example.com') }}">{{ config('mail.support_address', 'support@example.com') }}</a>.
      </p>
      <div class="footer-meta">
        <span class="footer-brand">{{ config('app.name') }}</span>
        <span class="footer-copy">&copy; {{ date('Y') }} All rights reserved.</span>
      </div>
    </div>

  </div>
</div>

</body>
</html>