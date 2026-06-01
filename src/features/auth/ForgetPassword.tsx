import { useState } from "react"
import StepEmail from "./steps/StepEmail";
import StepOTP from "./steps/StepOTP";
import StepPassword from "./steps/StepPassword";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword(){
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");

    return(
        <>
        {step === 1 && (
            <StepEmail 
            mode="forgot"
            onBack={() => navigate("/login")}
            onNext={async (email: string) => { setEmail(email); setStep(2) }}/>
        )}
        {step === 2 && (
            <StepOTP 
            email={email} 
            onNext={() => {setStep(3)}} 
            onBack={()=>setStep(1)}/>
        )}
        {step === 3 && (
            <StepPassword 
            mode="forgot"
            email={email} 
            onBack={() => setStep(2)}/>
        )}
        </>
    )
}