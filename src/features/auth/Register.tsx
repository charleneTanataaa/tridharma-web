import { useState } from "react";
import StepEmail from "./steps/StepEmail";
import StepOTP from "./steps/StepOTP";
import { useNavigate } from "react-router-dom";
import StepPassword from "./steps/StepPassword";
import StepProfile, { ProfileForm } from "./steps/StepProfile";

export default function Register(){
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [profile, setProfile] = useState<ProfileForm | null>(null);

    return(
        <>
        {step === 1 && (
            <StepEmail 
            mode="register"
            onBack={() => navigate("/login")}
            onNext={ async (email: string) => { setEmail(email); setStep(2); }}/>
        )}
        {step === 2 && (
            <StepOTP email={email}  
            onNext={()=> {setStep(3)}} 
            onBack={() => setStep(1)}/>
        )}
        {step===3 && (
            <StepProfile email={email} onBack={() => setStep(2)} onNext={(data)=>{setStep(4); setProfile(data);}} />
        )}
        {step === 4 && (
            <StepPassword mode="register" email={email} onBack={() => setStep(3)}/>)
        }
        </>
    )
}