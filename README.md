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

# PEMBELAJARAN — SURAT TUGAS

## Flow Status
```
none → pending_dekan → pending_kaprodi → approved
             ↓                ↓
          rejected ←←←←←← rejected
             ↓
       TU upload ulang
```

| Status          | Arti                                             |
|-----------------|--------------------------------------------------|
| none            | Belum ada surat tugas                            |
| pending_dekan   | TU sudah upload, menunggu persetujuan Dekan      |
| pending_kaprodi | Dekan approve, menunggu persetujuan Kaprodi      |
| approved        | Selesai — semua role bisa unduh                  |
| rejected        | Ditolak Dekan/Kaprodi — TU harus upload ulang   |

Surat tugas bersifat per-semester (bukan per-dosen).

## UI Logic (renderSuratTugas)
| Kondisi                         | Yang Tampil                           |
|---------------------------------|---------------------------------------|
| status approved (semua role)    | Tombol Unduh                          |
| TU + none / rejected            | Tombol Upload (+ alasan jika rejected)|
| TU + pending_*                  | Info "Menunggu..."                    |
| Dekan + pending_dekan           | Tombol Setujui / Tolak                |
| Kaprodi + pending_kaprodi       | Tombol Setujui / Tolak                |
| Role lain (dosen / bukan giliran)| Label status pasif                   |

## Key Files
- src/features/pembelajaran/Pembelajaran.tsx  → UI & state
- src/mock/authService.ts                     → Mock API functions
- src/mock/db.ts                              → Types & mock data
- src/hooks/useFetchData.ts                   → Generic fetch hook

## Mock API Functions (authService.ts)
- getMyPembelajaran(semId, userId, search)      → GET pembelajaran dosen sendiri
- getPembelajaranByDosen(semId, dosenId, search)→ GET pembelajaran dosen tertentu (admin/TU)
- uploadSuratTugasAPI(semesterId, fileName)     → TU upload → status: pending_dekan
- approveSuratTugasAPI(semesterId, role)        → Dekan→pending_kaprodi, Kaprodi→approved
- rejectSuratTugasAPI(semesterId, reason)       → rejected + simpan alasan

## Backend Integration Checklist
1. Buat src/api/pembelajaran.api.ts dengan real HTTP calls:
   - GET  /pembelajaran?semester={id}               → getMyPembelajaran (auth dari token)
   - GET  /pembelajaran?semester={id}&dosenId={id}  → getPembelajaranByDosen
   - POST /surat-tugas/upload (multipart/form-data) → uploadSuratTugasAPI
   - PATCH /surat-tugas/approve { semester_id }     → approveSuratTugasAPI
   - PATCH /surat-tugas/reject  { semester_id, reason } → rejectSuratTugasAPI

2. Ganti import di Pembelajaran.tsx (baris 11):
   from: "../../mock/authService"
   to:   "../../api/pembelajaran.api"

3. Update handleUpload untuk menerima File object dari <input type="file">
   (saat ini nama file hardcoded — perlu real file picker)

# PENELITIAN — FULL FLOW

## Flow Status
```
none → pending_kaprodi → pending_lppm → pending_surat_tugas → ongoing
              ↓               ↓
      revision_kaprodi   (rejected LPPM → didanai=false, tetap lanjut ke pending_surat_tugas)
```

| Status              | Arti                                                              |
|---------------------|-------------------------------------------------------------------|
| none                | Belum ada proposal                                               |
| pending_kaprodi     | Dosen upload proposal, menunggu Kaprodi                          |
| revision_kaprodi    | Kaprodi tolak — dosen perlu revisi (ada alasan + file revisi)   |
| pending_lppm        | Kaprodi setuju, menunggu LPPM                                    |
| pending_surat_tugas | LPPM selesai review (approved/rejected), TU perlu upload ST     |
| ongoing             | Surat tugas diupload — dosen upload laporan akhir, review, LoA  |

Catatan: Jika LPPM menolak (didanai=false), proses TETAP lanjut ke pending_surat_tugas.

## Fields Tambahan (PenelitianDetail)
| Field                    | Tipe             | Keterangan                              |
|--------------------------|------------------|-----------------------------------------|
| didanai                  | boolean \| null  | null sebelum LPPM review                |
| surat_tugas              | string \| null   | file ST yang diupload TU               |
| kaprodi_rejection_reason | string?          | alasan tolak kaprodi                    |
| kaprodi_revision_file    | string \| null?  | file revisi yang dikirim kaprodi        |
| lppm_rejection_reason    | string?          | alasan tolak LPPM                       |

## Key Files
- src/features/peneliitan/Penelitian.tsx      → list view + upload proposal modal
- src/features/peneliitan/PenelitianDetail.tsx → detail view + aksi approve/reject/upload
- src/mock/authService.ts                      → Mock API functions
- src/mock/db.ts                               → Types & mock data

## Mock API Functions (authService.ts)
- getPenelitian(idSem)                                   → GET list penelitian per semester
- getPenelitianDetailAPI(id)                             → GET detail penelitian
- getPenelitianByJurusan(jurusanId, idSem, search)       → GET list per jurusan (admin view)
- uploadProposalPenelitianAPI(id, fileName)              → Dosen upload → pending_kaprodi
- approveKaprodiPenelitianAPI(id)                        → Kaprodi setuju → pending_lppm
- rejectKaprodiPenelitianAPI(id, reason, revisionFile?)  → Kaprodi tolak → revision_kaprodi
- approveLPPMAPI(id)                                     → LPPM setuju → pending_surat_tugas, didanai=true
- rejectLPPMAPI(id, reason)                              → LPPM tolak → pending_surat_tugas, didanai=false
- uploadSuratTugasPenelitianAPI(id, fileName)            → TU upload ST → ongoing
- uploadPenelitianAPI(id, field, fileName)               → Dosen upload laporan_akhir/loa/hasil_review

## Backend Integration Checklist
1. Buat src/api/penelitian.api.ts dengan real HTTP calls:
   - GET    /penelitian?semester={id}                → getPenelitian
   - GET    /penelitian/{id}                         → getPenelitianDetailAPI
   - GET    /penelitian?semester={id}&jurusan={id}   → getPenelitianByJurusan
   - POST   /penelitian/proposal (multipart)         → uploadProposalPenelitianAPI
   - PATCH  /penelitian/{id}/kaprodi/approve         → approveKaprodiPenelitianAPI
   - PATCH  /penelitian/{id}/kaprodi/reject          → rejectKaprodiPenelitianAPI
   - PATCH  /penelitian/{id}/lppm/approve            → approveLPPMAPI
   - PATCH  /penelitian/{id}/lppm/reject             → rejectLPPMAPI
   - POST   /penelitian/{id}/surat-tugas (multipart) → uploadSuratTugasPenelitianAPI
   - POST   /penelitian/{id}/dokumen (multipart)     → uploadPenelitianAPI

2. Ganti import di PenelitianDetail.tsx:
   from: "../../mock/authService"
   to:   "../../api/penelitian.api"