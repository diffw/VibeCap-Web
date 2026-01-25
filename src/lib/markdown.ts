/**
 * Converts markdown bold syntax (**text**) to HTML strong tags
 */
export function renderMarkdown(text: string): string {
    if (!text) return text;

    // Replace **text** with <strong>text</strong>
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
