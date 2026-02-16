import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    containerClassName?: string;
    variant?: 'white' | 'surface' | 'dark';
}

export function Section({
    children,
    className,
    containerClassName,
    variant = 'white',
    ...props
}: SectionProps) {
    const variants = {
        white: 'bg-white',
        surface: 'bg-surface',
        dark: 'bg-primary text-white',
    };

    return (
        <section className={cn('py-16 md:py-24', variants[variant], className)} {...props}>
            <Container className={containerClassName}>{children}</Container>
        </section>
    );
}
