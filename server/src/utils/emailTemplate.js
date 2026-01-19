export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Email Verification</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #f5f7fa;
      color: #333333;
    }
    table, td {
      border-collapse: collapse;
    }
    .container {
      width: 100%;
      max-width: 520px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .header {
      background: #000000;
      padding: 20px;
      text-align: center;
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
    }
    .main-content {
      padding: 32px 28px;
    }
    .otp-box {
      display: inline-block;
      color: #000000;
      font-size: 20px;
      letter-spacing: 4px;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
    }
    .note {
      font-size: 13px;
      color: #666666;
    }
    @media only screen and (max-width: 480px) {
      .container {
        width: 90% !important;
      }
      .otp-box {
        font-size: 18px;
        padding: 10px 20px;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
    <tr>
      <td align="center">
        <table class="container">
          <tr><td class="header">Verify Your Email</td></tr>
          <tr>
            <td class="main-content">
              <p style="font-size: 16px; font-weight: 600; margin: 0 0 16px;">Hi there,</p>
              <p style="font-size: 14px; margin: 0 0 12px;">
                You're almost done! Please verify your account linked to <span style="color: #4C83EE; font-weight: 600;">{{email}}</span>.
              </p>
              <p style="font-size: 14px; font-weight: 600;">Use the OTP below to complete verification:</p>
              <div class="otp-box">{{otp}}</div>
              <p class="note">This OTP is valid for 24 hours. If you didn’t request this, you can safely ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Password Reset</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #f5f7fa;
      color: #333333;
    }
    table, td {
      border-collapse: collapse;
    }
    .container {
      width: 100%;
      max-width: 520px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .header {
      background: #000000;
      padding: 20px;
      text-align: center;
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
    }
    .main-content {
      padding: 32px 28px;
    }
    .otp-box {
      display: inline-block;
      color: #000000;
      font-size: 20px;
      letter-spacing: 4px;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
    }
    .note {
      font-size: 13px;
      color: #666666;
    }
    @media only screen and (max-width: 480px) {
      .container {
        width: 90% !important;
      }
      .otp-box {
        font-size: 18px;
        padding: 10px 20px;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
    <tr>
      <td align="center">
        <table class="container">
          <tr><td class="header">Password Reset Request</td></tr>
          <tr>
            <td class="main-content">
              <p style="font-size: 16px; font-weight: 600; margin: 0 0 16px;">Hi there,</p>
              <p style="font-size: 14px; margin: 0 0 12px;">
                We received a password reset request for your account <span style="color: #4C83EE; font-weight: 600;">{{email}}</span>.
              </p>
              <p style="font-size: 14px; font-weight: 600;">Use the OTP below to reset your password:</p>
              <div class="otp-box">{{otp}}</div>
              <p class="note">This OTP is valid for 15 minutes. If you didn’t request a password reset, you can ignore this message.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
