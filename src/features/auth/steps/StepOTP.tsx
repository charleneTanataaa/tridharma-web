import React, { useEffect, useRef, useState } from "react";
import AuthLayout from "../../../layouts/AuthLayout"
import { verifyOtpAPI } from "../../../mock/authService";

type StepOTPProps = {
    email: string;
    onNext: ()=>void;
    onBack: ()=> void;
};

export default function StepOTP({ email, onNext, onBack }: StepOTPProps){
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(120);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        if(countdown === 0 ){ setCanResend(true); return;}
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (index: number, value: string) => {
        if(!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        if(value && index < 5){
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Backspace" && !otp[index] && index > 0){
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, "").slice(0, 6);
        if(!pasted) return;
        const newOtp = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
        setOtp(newOtp);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const code = otp.join("");
        if(code.length < 6){
            setError("Masukkan 6 digit kode OTP.");
            return;
        }

        setLoading(true);
        try{
            // API
            await verifyOtpAPI(email, code);
            await new Promise((res) => setTimeout(res, 1000));
            onNext();
        } catch(err){
            setError("Kode OTP tidak valid atau sudah kedaluwarsa.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setCountdown(120);
        setCanResend(false);
        setOtp(["", "", "", "", "",""]);
        console.log("Resend OTP to", email);
    };

    return(
        <AuthLayout>
            <h1 className="text-xl font-semibold text-center mb-1">Cek Email Anda</h1>
            <p className="mb-6 text-center text-gray-500">Kode OTP telah dikirimkan ke {email}.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-3" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input 
                        type="text" 
                        key={index}
                        ref={(el) => { if (el) inputRefs.current[index] = el; }}
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-navy transition"/>
                    ))}
                </div>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <p className="text-sm text-center text-muted-text mb-6">
                    {canResend ? (
                        <button type="button" onClick={handleResend} className="text-primary-gold hover:text-light-gold transition-colors">
                            Kirim ulang OTP
                        </button>
                    ): (
                        <>Tidak dapat OTP? Kirim ulang dalam <span className="font-semibold">{countdown} detik.</span></>
                    )}
                </p>
                <div className="flex items-center justify-center flex-col gap-3">
                    <button type="submit" disabled={loading} className="font-semibold text-sm w-[300px] text-white bg-dark-navy hover:bg-medium-navy py-2 rounded-lg transition disabled:opacity-60">
                        {loading ? "Menverifikasi..." : "Verifikasi OTP"}
                    </button>

                    <button type="button" onClick={onBack} className="text-sm text-light-gold hover:text-primary-gold transition">
                        ← Kembali ke halaman sebelumnya
                    </button>
                </div>
            </form>
        </AuthLayout>
    )
}