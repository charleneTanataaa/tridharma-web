import AuthLayout from "../../layouts/AuthLayout";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { passwordSchema, uphEmailSchema } from "../../lib/validation";
import { FormField } from "../../components/ui/FormField";
import { getUserAPI, loginAPI } from "../../mock/authService"; // TODO: swap to real auth.service
import { useEffect, useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa6";

const loginSchema = z.object({
  email: uphEmailSchema,
  password: passwordSchema,
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const user = useAuthStore((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const response = await loginAPI(data.email, data.password);
      if(!response.success || !response.user || !response.token){
        throw new Error(response.message || "Email atau password salah")
      }
      setUser(response.user);
      setToken(response.token);
      toast.success("Login berhasil");
      navigate("/dashboard");
    } catch (err: any) {
      const isNetworkError =
        err?.response || err?.code === "ERR_NETWORK" || err?.message === "Network Error";
      const message = isNetworkError
        ? "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        : "Email atau password salah.";
      toast.error(message);
      setError("root", { message });
    }
  };

  return (
    <AuthLayout>
      <div className="flex justify-center mb-4">
        <img src="/uph-logo.png" alt="Logo UPH" className="w-[150px] lg:w-[300px]" />
      </div>
      <h1 className="font-semibold uppercase text-lg lg:text-2xl text-primary-text mb-4">LOGIN</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          type="email"
          id="email"
          label="Email"
          placeholder="Email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          type={showPassword ? "text" : "password"}
          id="password"
          label="Password"
          error={errors.password?.message}
          {...register("password")}
          placeholder="Password"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              className="text-secondary-text"
            >
              {showPassword ? <FaEye /> : <FaRegEyeSlash />}
            </button>
          }
        />
        {errors.root && (
          <p className="text-sm text-red-500 text-center">{errors.root.message}</p>
        )}
        <div className="text-end">
          <button
            onClick={() => navigate("/forget-password")}
            type="button"
            className="text-sm text-primary-gold transition-colors hover:text-light-gold"
          >
            Lupa kata sandi?
          </button>
        </div>
        <div className="flex flex-col gap-3 items-center justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-sm w-[300px] text-white bg-dark-navy hover:bg-medium-navy py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
          <button
            onClick={() => navigate("/register")}
            type="button"
            className="text-sm text-primary-gold transition-colors hover:text-light-gold"
          >
            Belum punya akun? <span className="underline">Register</span>
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}