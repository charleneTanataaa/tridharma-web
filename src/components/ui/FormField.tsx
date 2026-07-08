import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
  rightIcon?: ReactNode;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, error, rightIcon, className, ...inputProps }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-sm font-medium text-muted-text">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            ref={ref}
            className={`w-full bg-primary-cream p-3 rounded placeholder:text-muted-text/70 outline-none focus:border-primary-gold focus:ring-4 focus:ring-primary-gold/10 ${
              rightIcon ? "pr-11" : ""
            } ${className ?? ""}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...inputProps}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";