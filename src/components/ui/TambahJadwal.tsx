import { useEffect } from "react";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schema & Types
// ---------------------------------------------------------------------------

const HARI_OPTIONS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
] as const;

const jadwalItemSchema = z
  .object({
    hari: z.string().min(1, "Hari wajib diisi"),
    jam_mulai: z.string().min(1, "Jam mulai wajib diisi"),
    jam_selesai: z.string().min(1, "Jam selesai wajib diisi"),
  })
  .refine((data) => data.jam_mulai < data.jam_selesai, {
    message: "Jam selesai harus setelah jam mulai",
    path: ["jam_selesai"],
  });

const tambahJadwalSchema = z.object({
  idMatkul: z.coerce.number().min(1, "Mata kuliah wajib dipilih"),
  idSemester: z.coerce.number().min(1, "Semester wajib dipilih"),
  idKelas: z.coerce.number().min(1, "Kelas wajib dipilih"),
  sks: z.coerce.number().min(1, "SKS wajib diisi").max(6, "SKS maksimal 6"),

  jadwal: z.array(jadwalItemSchema).min(1, "Minimal 1 jadwal harus ditambahkan"),

  linkLpp: z.string().url("Link tidak valid").or(z.literal("")).optional(),
  linkRps: z.string().url("Link tidak valid").or(z.literal("")).optional(),
  linkUts: z.string().url("Link tidak valid").or(z.literal("")).optional(),
  linkEpputs: z.string().url("Link tidak valid").or(z.literal("")).optional(),
  linkUas: z.string().url("Link tidak valid").or(z.literal("")).optional(),
  linkEppuas: z.string().url("Link tidak valid").or(z.literal("")).optional(),
});

export type TambahJadwalPayload = z.infer<typeof tambahJadwalSchema>;

// Opsi dropdown — diasumsikan datanya sudah di-fetch oleh parent
// (Pembelajaran.tsx) karena modal ini tidak boleh memanggil API sendiri.
interface OptionItem {
  id: number;
  nama: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: TambahJadwalPayload) => void;

  matkulOptions: OptionItem[];
  semesterOptions: OptionItem[];
  kelasOptions: OptionItem[];

  isSubmitting?: boolean;
}

const emptyJadwal = { hari: "", jam_mulai: "", jam_selesai: "" };

const defaultValues: TambahJadwalPayload = {
  idMatkul: 0,
  idSemester: 0,
  idKelas: 0,
  sks: 0,
  jadwal: [emptyJadwal],
  linkLpp: "",
  linkRps: "",
  linkUts: "",
  linkEpputs: "",
  linkUas: "",
  linkEppuas: "",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TambahJadwal({
  open,
  onClose,
  onSubmit,
  matkulOptions,
  semesterOptions,
  kelasOptions,
  isSubmitting = false,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TambahJadwalPayload>({
    // z.coerce.number() makes the resolver's *input* type differ from its
    // *output* type (unknown -> number), which trips up RHF's generic
    // inference. Cast explicitly to the payload shape to resolve it.
    resolver: zodResolver(tambahJadwalSchema) as Resolver<TambahJadwalPayload>,
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "jadwal",
  });

  // Reset form setiap kali modal dibuka kembali
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  if (!open) return null;

  const submitHandler = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Tambah Pembelajaran
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submitHandler} className="space-y-6 px-6 py-5">
          {/* Informasi Mata Kuliah */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Informasi Mata Kuliah
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Mata Kuliah
                </label>
                <select
                  {...register("idMatkul")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value={0}>Pilih Mata Kuliah</option>
                  {matkulOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.nama}
                    </option>
                  ))}
                </select>
                {errors.idMatkul && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.idMatkul.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Semester
                </label>
                <select
                  {...register("idSemester")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value={0}>Pilih Semester</option>
                  {semesterOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.nama}
                    </option>
                  ))}
                </select>
                {errors.idSemester && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.idSemester.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Kelas
                </label>
                <select
                  {...register("idKelas")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value={0}>Pilih Kelas</option>
                  {kelasOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.nama}
                    </option>
                  ))}
                </select>
                {errors.idKelas && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.idKelas.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  SKS
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  {...register("sks")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                {errors.sks && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.sks.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Jadwal */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Jadwal</h3>
              <button
                type="button"
                onClick={() => append(emptyJadwal)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                + Tambah Jadwal
              </button>
            </div>

            {errors.jadwal?.root && (
              <p className="text-xs text-red-500">{errors.jadwal.root.message}</p>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-3 sm:grid-cols-[1.2fr_1fr_1fr_auto]"
                >
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Hari
                    </label>
                    <select
                      {...register(`jadwal.${index}.hari` as const)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Pilih Hari</option>
                      {HARI_OPTIONS.map((hari) => (
                        <option key={hari} value={hari}>
                          {hari}
                        </option>
                      ))}
                    </select>
                    {errors.jadwal?.[index]?.hari && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.jadwal[index]?.hari?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      {...register(`jadwal.${index}.jam_mulai` as const)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    {errors.jadwal?.[index]?.jam_mulai && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.jadwal[index]?.jam_mulai?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      {...register(`jadwal.${index}.jam_selesai` as const)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    {errors.jadwal?.[index]?.jam_selesai && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.jadwal[index]?.jam_selesai?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Link */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Link</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(
                [
                  ["linkLpp", "Link LPP"],
                  ["linkRps", "Link RPS"],
                  ["linkUts", "Link UTS"],
                  ["linkEpputs", "Link EPP UTS"],
                  ["linkUas", "Link UAS"],
                  ["linkEppuas", "Link EPP UAS"],
                ] as const
              ).map(([name, label]) => (
                <div key={name}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    {...register(name)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  {errors[name] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors[name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}