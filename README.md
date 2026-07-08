# INSTALLATION
```bash
npm install
```

# RUN (localhost:5137)
```bash
npm run dev
```

# FOLDER STRUCTURE
- components -> reusable components
- features -> pages
- layouts -> Auth Layout & Dashboard Layout
- stores -> state manangement (Zustand)
- lib -> helpers (clsx)
- mock -> data
- types -> variable types declaration
- routes 

# LIBRARY
- reack-hook-form: manages form state
- useForm(): hook from react-hook-form
- zod: validates data rules

# LOGIN 
1. User login
2. Validate frontend (zod + react-hook-form)
3. POST /auth/login
4. Backend sets cookie/token
5. Backend returns user data
    { user: {
        id, name, email, role
    }}
6. Store user data in Zustand
7. Navigate("/dashboard")

# FORGET PASSWORD
1. User enter email (step 1)
2. Validate email
3. Send OTP to email 
4. User enter OTP (step 2)
5. Validate OTP
6. User enter password and confirm password (step 3)
7. Navigate to ("/login")

# REGISTER
1. User enter email (step 1)
2. Validate email
3. Send OTP to email 
4. User enter OTP (step 2)
5. Validate OTP
6. User fills profile (step 3)
7. User enter password and confirm password (step 3)
8. Navigate to ("/login")


# DASHBOARD
1. Welcome sign
2. Broadcast list
3. Add broadcast (kaprodi + dekan)

# NOTIFICATION
1. Notification icon with amount of unread notification
2. Read notification (blue circle)
3. Unread notification (muted blue circle)
4. On click -> direct to page