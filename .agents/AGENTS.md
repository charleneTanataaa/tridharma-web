# Tridharma Workflows and Rules

## Role-Based Tridharma Navigation
- If the user is **NOT** a lecturer (`dosen`), accessing Tri Dharma navigates through:
  `Jurusan` -> `Semester` -> `Tri Dharma (Mata Kuliah / Penelitian / PKM / Penunjang)`.
- If the user is a lecturer (`dosen`), they go directly to their own Tri Dharma details.
- **Data Dosen**: Accessible by all roles except `dosen`. Follows the flow: `Dosen List` -> `Dosen Profile` -> `Dosen Tri Dharma`.

## Core Roles & Permissions
- **Tata Usaha (TU)**: Uploads `surat tugas`.
- **LPPM, Dekan, Kaprodi**: Manage approval/rejection modal actions.

## Feature Workflows

### 1. Pembelajaran Flow
1. Tata Usaha opens the semester.
2. Prodi creates the schedule.
3. Tata Usaha creates the `surat tugas`.
4. `surat tugas` must be approved by Dekan & Kaprodi.
5. Tata Usaha uploads the `surat tugas`.
6. Dosen uploads their teaching administration data (soal UAS, UTS, absensi, dll).

### 2. Penelitian (Research) Flow
1. Tata Usaha opens the semester.
2. Dosen uploads the proposal.
3. Kaprodi reviews the proposal (can reject with a reason and send a revision file).
4. LPPM reviews the proposal.
   - *If rejected by LPPM*: The research is not funded, but the process still continues to the next step.
5. Tata Usaha uploads the `surat tugas`.
6. Dosen uploads the final report (`laporan akhir`), review results (`hasil review`), and letter of acceptance (`LoA`).

### 3. PKM (Community Service) Flow
- Follows the exact same workflow as **Penelitian**.

### 4. Penunjang (Support Activities) Flow
1. Dosen uploads a flyer.
2. Kaprodi reviews it (can reject with a reason and send a revision file).
3. Tata Usaha uploads the `surat tugas`.
4. Dosen uploads the certificate.
