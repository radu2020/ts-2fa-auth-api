# ts-2fa-auth-api

## Solution
This solution will implement a User Registration and Login API using Express.js and TypeScript, supporting 2FA (Two-Factor Authentication) via a combination of SMS (using services like Twilio) and a secure password. The project includes the following key functionalities based on the user story:

## Key Features
1. Register: A user can register with their name, email, mobile, and password.
2. Login with 2FA: A user can log in by providing their email, password, and a verification code sent via SMS.
3. Profile Management: The user can update their name and email, but not their mobile number.
4. Password Change: Changing the password requires SMS verification.
5. 2FA: We will generate and validate a Time-based One-Time Password (TOTP) for the user. Twilio (or other SMS services) will be used for sending OTP via SMS.

## Tools & Packages
- Express.js: For building API endpoints.
- TypeScript: For type safety and better code management.
- bcrypt: For securely hashing passwords.
- jsonwebtoken (JWT): For generating tokens to handle authenticated sessions.
- Twilio (or similar): To send OTP codes via SMS.
- Speakeasy: For generating and verifying time-based OTP (TOTP).
- dotenv: For handling environment variables.

## Project Structure
```
ts-2fa-auth-api/
│
├── src/
│   ├── app.ts
│   ├── routes/
│   │   └── auth.ts
│   ├── services/
│   │   ├── authService.ts
│   │   └── userService.ts
│   ├── utils/
│   │   └── jwt.ts
│   └── config/
│       └── twilio.ts
├── .env
└── tsconfig.json
```

## How to run

1. Install the dependencies:
```
npm install
```

2. Update environment variables in .env:

3. 
```
npm run start
```

## Testing the API
Use cURL or Postman to make requests.

1. Register User:

POST /auth/register
```
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+4915226043242",
  "password": "password123"
}

{
    "message": "User registered successfully"
}
```

2. Login (2FA Code Sent via SMS):

POST /auth/login
```
{
  "email": "john@example.com",
  "password": "password123"
}

{
    "message": "2FA code sent via SMS",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MjkwNzA0NjcsImV4cCI6MTcyOTA3NDA2N30.OtyGarTw9s-8IA8OPRrAV6GpWTLkHtB5Ufj5ZGPKXhw"
}
```

3. Verify 2FA:

POST/auth/verify-2fa
```
{
  "email": "john@example.com",
  "code": 205478
}

{
    "message": "Login successful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MjkwNzA0ODMsImV4cCI6MTcyOTA3NDA4M30.bPhCrnziO_JTAGnhSXxPeS-3xIiKmGMo7GyckV5StLM"
}
```

4. Update Profile:

PUT /auth/profile
```
{
  "email": "john@example.com",
  "name": "John Doe",
  "newEmail": "john1@example.com"
}

{
    "message": "User profile updated successfully"
}
```

5. Change Password:

PUT /auth/change-password
```
{
  "email": "john@example.com",
  "newPassword": "newPassword",
  "smsCode": 575635
}

{
    "message": "Password changed successfully"
}
```

## General questions

Q: How much time did you spend working on the solution?
A: 3-4 Hours in total with documenting and testing requests from Postman.

Q: What’s the part of the solution you are most proud of?
A: I am proud of the part which sends the code via SMS!

Q: If you had more time, what other things you would like to do?
A: Implement a DB UserStore and write tests.

Q: Do you have any feedback regarding this coding challenge?
A: It was really fun! 🚀

## That's all folks!