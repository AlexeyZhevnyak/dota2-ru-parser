/**
 * Utility function to convert markdown to HTML
 */

/**
 * Converts markdown text to HTML
 * Handles common markdown syntax:
 * - Headers (# to ######)
 * - Bold (**text**)
 * - Italic (*text*)
 * - Code blocks (```code```)
 * - Inline code (`code`)
 * - Lists (- item or * item)
 * - Links [text](url)
 * 
 * @param markdown - The markdown text to convert
 * @returns HTML string
 */
export const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';

  // Process code blocks first (```)
  let html = markdown.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });

  // Process headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Process bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Process italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Process inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Process lists
  html = html.replace(/^\s*[-*]\s+(.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
  
  // Fix nested lists (remove duplicate ul tags)
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Process links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Process paragraphs (lines that are not already wrapped in HTML tags)
  html = html.replace(/^(?!<[a-z]).+/gm, (line) => {
    return line.trim() ? `<p>${line}</p>` : '';
  });

  // Remove empty paragraphs
  html = html.replace(/<p><\/p>/g, '');

  return html;
};