import React from 'react';

interface HighlightedTextProps {
    text?: string | null;
    highlight?: string;
    className?: string;
}

export function HighlightedText({ text, highlight, className }: HighlightedTextProps) {
    if (!text) return null;
    if (!highlight || !highlight.trim()) return <span className={className}>{text}</span>;

    const searchTerm = highlight.trim();
    // Escape special characters for RegExp
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedSearchTerm})`, 'gi'));

    return (
        <span className={className}>
            {parts.map((part, index) =>
                part.toLowerCase() === searchTerm.toLowerCase() ? (
                    <mark
                        key={index}
                        className="bg-yellow-200 text-inherit dark:bg-yellow-900/60 rounded-sm font-semibold underline decoration-yellow-500 dark:decoration-yellow-400 decoration-2 underline-offset-2"
                    >
                        {part}
                    </mark>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </span>
    );
}
