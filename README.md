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
7. POST /auth/forget-password (?)
8. Navigate("/login")