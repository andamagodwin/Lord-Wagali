import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ title, variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'items-center rounded-2xl px-6 py-4';
  const variants = {
    primary: 'bg-coral',
    secondary: 'bg-navy-700',
    outline: 'border border-navy-600',
  };
  const textVariants = {
    primary: 'text-navy-950 font-bold',
    secondary: 'text-white font-semibold',
    outline: 'text-coral font-semibold',
  };

  return (
    <TouchableOpacity
      className={`${base} ${variants[variant]} ${className}`}
      activeOpacity={0.8}
      {...props}>
      <Text className={`text-base ${textVariants[variant]}`}>{title}</Text>
    </TouchableOpacity>
  );
}
