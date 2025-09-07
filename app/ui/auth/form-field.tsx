"use client";

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type: "text" | "email" | "password";
  placeholder: string;
  required?: boolean;
  minLength?: number;
  icon: React.ComponentType<{ className?: string }>;
}

export function FormField({ 
  label, 
  id, 
  name, 
  type, 
  placeholder, 
  required = false, 
  minLength,
  icon: Icon 
}: FormFieldProps) {
  return (
    <div>
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
        />
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
    </div>
  );
}