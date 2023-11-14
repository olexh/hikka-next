'use client';

import clsx from 'clsx';

interface Props {
    onChange?: (value: number) => void;
    readonly?: boolean;
    value?: number;
    className?: string;
}

const Component = ({ onChange, readonly, value, className }: Props) => {
    return (
        <div className={clsx("rating rating-sm rating-half relative", readonly && "readonly", className)}>
            <input
                type="radio"
                name="rating-10"
                value={0}
                checked={Number(value) === 0}
                onChange={(e) => onChange && onChange(Number(e.target.value))}
                className="rating-hidden absolute -left-1 z-10"
            />
            {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <input
                    key={v}
                    type="radio"
                    name="rating-10"
                    value={v}
                    checked={Number(value) === v}
                    onChange={(e) => onChange && onChange(Number(e.target.value))}
                    className={clsx(
                        'bg-orange-400 mask mask-star-2',
                        v % 2 === 0 ? 'mask-half-2' : 'mask-half-1',
                    )}
                />
            ))}
        </div>
    );
};

export default Component;
