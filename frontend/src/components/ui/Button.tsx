import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-fh-gold text-fh-charcoal font-semibold hover:bg-fh-gold/90 active:bg-fh-gold/80',
  secondary:
    'border border-fh-gold text-fh-gold bg-transparent hover:bg-fh-gold/10 active:bg-fh-gold/20',
  ghost:
    'bg-transparent text-fh-offwhite hover:bg-white/5 active:bg-white/10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', fullWidth = false, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm text-sm tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          fullWidth ? 'w-full' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
