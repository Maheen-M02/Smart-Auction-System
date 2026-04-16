# 🔄 System Flow Diagrams

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

START
  │
  ├─► Open Application (http://localhost:3000)
  │
  ├─► Login Page
  │   │
  │   ├─► Enter Government ID
  │   │   ├─► PAN: ABCDE1234F
  │   │   └─► Aadhaar: 123456789012
  │   │
  │   ├─► Validate Format
  │   │   ├─► Valid ✅
  │   │   └─► Invalid ❌ → Show Error
  │   │
  │   ├─► Check User Exists
  │   │   ├─► New User → Create Account
