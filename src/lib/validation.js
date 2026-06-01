import { z } from "zod";

export const uphEmailSchema = z
  .string()
  .email("Email tidak valid")
  .refine(
    (email) => email.endsWith("@uph.edu") || email.endsWith("@lecturer.uph.edu"),
    { message: "Masukkan email UPH yang valid." }
  );

export const passwordSchema = z.string().min(1, "Password tidak boleh kosong");