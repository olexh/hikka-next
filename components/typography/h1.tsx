import { ReactNode } from 'react';

import { cn } from '@/utils/utils';

interface Props {
    children: ReactNode | string;
    className?: string;
}

export default function H1({ children, className }: Props) {
    return (
        <h1
            className={cn(
                'scroll-m-20 font-display text-4xl font-bold tracking-normal lg:text-5xl',
                className,
            )}
        >
            {children}
        </h1>
    );
}
