import z from "zod";
import AuthLayout from "../../../layouts/AuthLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "../../../components/ui/FormField";
import { uphEmailSchema } from "../../../lib/validation";
import { useForm, SubmitHandler } from "react-hook-form";
import { sendOtpAPI } from "../../../mock/authService";

const schema = z.object({ email: uphEmailSchema });

type StepEmailForm = z.infer<typeof schema>;
type AuthMode = "forgot" | "register";

type StepEmailProps = {
    mode?: AuthMode;
    onBack?: () => void;
    onNext: (email: string) => Promise<void>;
};

const content: Record<AuthMode, { title: string; desc: string; button: string }> = {
    forgot: {
        title: "Lupa Kata Sandi",
        desc: "Masukkan email UPH kamu untuk menerima kode OTP",
        button: "Kirim OTP",
    },
    register: {
        title: "Daftar Akun",
        desc: "Masukkan email UPH kamu untuk memulai pendaftaran.",
        button: "Kirim OTP",
    },
};

export default function StepEmail({ onBack, onNext, mode = "forgot" }: StepEmailProps) {
    const { title, button } = content[mode];
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<StepEmailForm>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<StepEmailForm> = async (data) => {
        try {
            await sendOtpAPI(data.email, mode);
            await onNext(data.email);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Terjadi kesalahan, coba lagi.";
            setError("email", { message });
        }
    };

    return (
        <AuthLayout>
            <div className="flex justify-center mb-5">
                <img src="/uph-logo.png" alt="Logo UPH" className="w-[150px] lg:w-[300px]" />
            </div>
            <h1 className="font-semibold uppercase mb-4 text-lg lg:text-2xl">{title}</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField label="Email" id="email" type="email" placeholder="Masukkan email" error={errors.email?.message} {...register("email")} />
                <div className="flex items-center justify-center flex-col gap-3">
                    <button type="submit" disabled={isSubmitting} className="font-semibold text-sm w-[300px] text-white bg-dark-navy hover:bg-medium-navy py-2 rounded-lg transition disabled:opacity-60">
                        {isSubmitting ? "Mengirim..." : button}
                    </button>
                    {onBack && (
                        <button type="button" onClick={onBack} className="text-sm text-primary-gold hover:text-light-gold transition-colors">
                            Balik ke login
                        </button>
                    )}
                </div>
            </form>
        </AuthLayout>
    );
}