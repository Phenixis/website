'use client';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { HoverExpandPill } from "@/components/ui/hover-expand-pill";
import { useStyle } from "@/contexts/style-context";
import { type StyleVariant, isValidStyleVariant, styleOptions } from '@/lib/style-flag';

const record: Record<StyleVariant, React.ComponentType> = {
    classical: StyleSelectClassical,
    modern: StyleSelectModern,
}

export default function StyleSelect() {
    const { currentStyle } = useStyle();

    const Component = record[currentStyle] || StyleSelectClassical;

    return <Component />;
}

function StyleSelectClassical() {
    const { currentStyle, setStyle, isPending } = useStyle();

    const handleStyleChange = (value: string) => {
        if (isValidStyleVariant(value)) {
            setStyle(value);
        }
    };

    return (
        <Select
            value={currentStyle}
            onValueChange={handleStyleChange}
            disabled={isPending}
        >
            <SelectTrigger className="w-45">
                <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {styleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

function StyleSelectModern() {
    const { currentStyle, setStyle, isPending } = useStyle();

    const pillOptions = styleOptions.map((option) => ({
        value: option.value,
        label: option.label,
        onClick: () => {
            if (!isPending) setStyle(option.value);
        },
        disabled: isPending,
    }));

    return (
        <HoverExpandPill
            options={pillOptions}
            currentValue={currentStyle}
        />
    );
}