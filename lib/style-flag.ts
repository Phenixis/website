export type StyleVariant = "classical" | "modern";

export interface StyleOption {
    value: StyleVariant;
    label: string;
}

export const styleOptions: StyleOption[] = [
    { value: "classical", label: "Classical" },
    { value: "modern", label: "Modern" },
] as const;

/**
 * Check if a style variant exists in the registry
 * @param style - Style variant to check
 * @returns True if the style exists
 */
export function isValidStyleVariant(style: string): style is StyleVariant {
    return styleOptions.some(opt => opt.value === style);
}