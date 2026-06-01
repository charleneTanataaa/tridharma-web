import AuthLayout from "../../layouts/AuthLayout";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { passwordSchema, uphEmailSchema } from "../../lib/validation";
import { FormField } from "../../components/ui/FormField";
import { getUserAPI, loginAPI } from "../../mock/authService";
import { useEffect } from "react";

const loginSchema = z.object({
  email: uphEmailSchema,
  password: passwordSchema,
});

export default function Login(){
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) navigate("/dashboard", {replace: true});
  }, [user]);

  const { register, handleSubmit, setError, formState: {errors},
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  type LoginForm = z.infer<typeof loginSchema>;

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try{
      const { access_token } = await loginAPI(data.email, data.password);
      setToken(access_token);
      
      const user = await getUserAPI(access_token);
      setUser(user);
      
      toast.success(`Login berhasil!`);
      navigate("/dashboard");
    } catch (err){
      toast.error("Email atau password salah");
      setError("root", {message: "Email atau password salah"});
    }  
  }

  return (
    <AuthLayout>
      <div className="flex justify-center mb-4">
        <img src="/uph-logo.png" alt="Logo UPH" className="w-[300px]"/>
      </div>
      <h1 className="font-semibold uppercase text-2xl text-primary-text mb-4">LOGIN</h1>
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
          type="password" 
          id="password"
          label="Password"
          error={errors.password?.message}
          {...register("password")}
          placeholder="Password"
          />
          {errors.root && (
            <p className="text-sm text-red-500 text-center">{errors.root.message}</p>
          )}
          <div className="text-end">
          <button onClick={() => navigate("/forget-password")} type="button" className="text-sm text-primary-gold transition-colors hover:text-light-gold">Lupa kata sandi?</button>
          </div>

          <div className="flex flex-col gap-3 items-center justify-center">
            <button type="submit" className="text-sm w-[300px] text-white bg-dark-navy hover:bg-medium-navy py-2 rounded-lg transition">Masuk</button>
            <button onClick={() => navigate("/register")} type="button" className="text-sm text-primary-gold transition-colors hover:text-light-gold">
              Belum punya akun? <span className="underline">Register</span>
              </button>
          </div>
      </form>
    </AuthLayout>
  );
}