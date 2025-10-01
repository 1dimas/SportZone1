# TODO: Implement Forgot Password Feature in Frontend

## Steps to Complete:
- [x] Add forgotPassword, verifyOtp, resetPassword methods in src/components/lib/services/auth.service.ts
- [x] Create multi-step forgot password page in src/app/forgot-password/page.tsx
  - Step 1: Input email to request OTP
  - Step 2: Input OTP to verify
  - Step 3: Input new password to reset
  - Step 4: Success message and link back to login
- [x] Update src/components/login-form.tsx to link "Forgot your password?" to /forgot-password page
- [ ] Test the forgot password flow end-to-end in the frontend
