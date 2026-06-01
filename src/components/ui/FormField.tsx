import { InputHTMLAttributes } from "react"

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    id: string;
    error?: string;
}
export function FormField({ label, id, error, ...inputProps}: FormFieldProps) {
    return(
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-medium text-muted-text">
                {label}
            </label>
            <input 
            id={id} 
            className="w-full bg-primary-cream p-3 rounded placeholder:text-muted-text/70 outline-none focus:border-primary-gold focus:ring-4 focus:ring-primary-gold/10" 
            {...inputProps}/>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}