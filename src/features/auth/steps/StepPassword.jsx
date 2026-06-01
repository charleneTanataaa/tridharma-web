import { useNavigate, useSearchParams } from "react-router-dom";
import { FormField } from "../../../components/ui/FormField"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";
import AuthLayout from "../../../layouts/AuthLayout";
import { useState } from "react";
import { resetPasswordAPI } from "../../../mock/authService";

const schema = z.object({
    password: z.string().min(6, "Kata sandi minimal 6 karakter."),
    confirmPassword: z.string(), 
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
});

export default function StepPassword({ email, onBack, mode="forgot" }){
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm({ resolver: zodResolver(schema), });
    const onSubmit = async (data) => {
        if(mode === "register"){
            await resetPasswordAPI({ email, password: data.password})
            toast.success("Akun sudah diregister!");

        } else {
            // await api.resetPassword({ email, password: data.password })
            toast.success("Kata sandi berhasil diubah!");
        }
        navigate("/login");
    };

    return(
        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <h1 className="text-xl font-semibold">{mode === "forgot" ? "Ganti kata sandi" : "Buat Kata Sandi"}</h1>
                <FormField type="password" label="Kata Sandi" placeholder="Masukkan kata sandi baru" id="password" error={errors.password?.message} {...register("password")}/>
                <FormField type="password" label="Konfirmasi Kata Sandi" placeholder="Konfirmasi kata sandi" id="confirmPassword" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

                <div className="flex items-center justify-center flex-col gap-3">
                    <button type="submit" className="bg-dark-navy rounded-xl py-3 w-[300px] text-white font-semibold text-center">{mode === "forgot" ? "Ganti kata sandi" : "Buat Kata Sandi"}</button>
                    <button type="button" onClick={() => navigate("/login")} className="text-sm text-light-gold hover:text-primary-gold transition">
                        Balik ke login.
                    </button>
                </div>
            </form>

        </AuthLayout>
    )
}