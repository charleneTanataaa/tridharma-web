import { useNavigate, useSearchParams } from "react-router-dom";
import { FormField } from "../../../components/ui/FormField"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";
import AuthLayout from "../../../layouts/AuthLayout";

const schema = z.object({
    password: z.string().min(6, "Kata sandi minimal 6 karakter."),
    confirmPassword: z.string(), 
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof schema>;

type StepPasswordProps={email:string; onBack: () => void;};

export default function StepPassword({ email, onBack }: StepPasswordProps){
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm<PasswordForm>({ resolver: zodResolver(schema), });
    const onSubmit = async (data: PasswordForm) => {
            // await api.resetPassword({ email, password: data.password })
            toast.success("Kata sandi berhasil diubah!");
        navigate("/login");
    };

    return(
        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h1 className="text-xl font-semibold">Ganti kata sandi</h1>
                <FormField type="password" label="Kata Sandi" placeholder="Masukkan kata sandi baru" id="password" error={errors.password?.message} {...register("password")}/>
                <FormField type="password" label="Konfirmasi Kata Sandi" placeholder="Konfirmasi kata sandi" id="confirmPassword" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

                <div className="flex items-center justify-center flex-col gap-3">
                    <button type="submit" className="bg-dark-navy rounded-xl py-3 w-[300px] text-white font-semibold text-center">"Ganti kata sandi"</button>
                    <button type="button" onClick={onBack} className="text-sm text-light-gold hover:text-primary-gold transition">
                        Kembali
                    </button>
                </div>
            </form>

        </AuthLayout>
    )
}