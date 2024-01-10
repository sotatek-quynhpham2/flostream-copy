import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    secondary?: boolean
    disabled?: boolean
}

export const Button = ({ secondary = false, className = '', disabled = false, ...props }: ButtonProps) => {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`
        relative
        px-3 py-[6px]
        rounded-[8px]
        transition-all
        shadow-md sm:hover:shadow-lg
        font-medium
        text-left
        ${className || (secondary ? 'mt-5 bg-success text-white' : 'bg-success text-white ')}
        ${disabled ? 'bg-disableBtn' : 'bg-flos'}
      `}
        />
    )
}
