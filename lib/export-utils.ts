import { Document, Packer, Paragraph, TextRun } from 'docx';
import MarkdownIt from 'markdown-it';
import Papa from 'papaparse';
import html2pdf from 'html2pdf.js';

// Convert TipTap JSON content to HTML
export function jsonToHtml(content: any): string {
  // This is a simplified version - a real implementation would be more complex
  if (!content) return '';
  
  let html = '';
  
  // Recursively process nodes
  function processNode(node: any): string {
    if (node.type === 'doc') {
      return node.content?.map(processNode).join('') || '';
    }
    
    if (node.type === 'paragraph') {
      return `<p>${node.content?.map(processNode).join('') || ''}</p>`;
    }
    
    if (node.type === 'text') {
      let text = node.text || '';
      
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === 'bold') {
            text = `<strong>${text}</strong>`;
          } else if (mark.type === 'italic') {
            text = `<em>${text}</em>`;
          } else if (mark.type === 'code') {
            text = `<code>${text}</code>`;
          }
        }
      }
      
      return text;
    }
    
    if (node.type === 'heading') {
      const level = node.attrs?.level || 1;
      return `<h${level}>${node.content?.map(processNode).join('') || ''}</h${level}>`;
    }
    
    if (node.type === 'bulletList') {
      return `<ul>${node.content?.map(processNode).join('') || ''}</ul>`;
    }
    
    if (node.type === 'orderedList') {
      return `<ol>${node.content?.map(processNode).join('') || ''}</ol>`;
    }
    
    if (node.type === 'listItem') {
      return `<li>${node.content?.map(processNode).join('') || ''}</li>`;
    }
    
    if (node.type === 'image') {
      return `<img src="${node.attrs?.src || ''}" alt="${node.attrs?.alt || ''}" />`;
    }
    
    if (node.content) {
      return node.content.map(processNode).join('');
    }
    
    return '';
  }
  
  html = processNode(content);
  return html;
}

// Convert TipTap JSON content to Markdown
export function jsonToMarkdown(content: any): string {
  // Convert to HTML first
  const html = jsonToHtml(content);
  
  // Use a reverse parser from HTML to Markdown
  // This is simplified - in a real app you'd want a more robust solution
  // For example, use turndown or a similar library
  
  // For this example, we'll use a simple regex-based approach
  let markdown = html
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<ul>(.*?)<\/ul>/g, '$1\n')
    .replace(/<ol>(.*?)<\/ol>/g, '$1\n')
    .replace(/<li>(.*?)<\/li>/g, '- $1\n')
    .replace(/<img src="(.*?)" alt="(.*?)" \/>/g, '![$2]($1)');
  
  return markdown;
}

// Export to PDF
export async function exportToPdf(content: any, filename: string): Promise<void> {
  try {
    const html = jsonToHtml(content);
    const element = document.createElement('div');
    element.innerHTML = html;
    document.body.appendChild(element);
    
    const opt = {
      margin: 1,
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    await html2pdf().set(opt).from(element).save();
    document.body.removeChild(element);
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF');
  }
}

// Export to DOCX
export async function exportToDocx(content: any, filename: string): Promise<Blob> {
  try {
    const html = jsonToHtml(content);
    
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extract text from HTML
    const textContent = tempDiv.textContent || '';
    
    // Create a simple DOCX document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun(textContent)
              ]
            })
          ]
        }
      ]
    });
    
    // Generate a blob from the document
    const blob = await Packer.toBlob(doc);
    
    // Create a download link and trigger it
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return blob;
  } catch (error) {
    console.error('DOCX export error:', error);
    throw new Error('Failed to export DOCX');
  }
}

// Export to CSV
export function exportToCsv(content: any, filename: string): void {
  try {
    // For CSV, we'll create a simple representation with headers and content
    // This is very simplified and would need to be customized based on your data structure
    const html = jsonToHtml(content);
    
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extract text from HTML
    const textContent = tempDiv.textContent || '';
    
    // Split by newlines to get "rows"
    const rows = textContent.split('\n').filter(row => row.trim() !== '');
    
    // Create a data structure for CSV
    const csvData = rows.map(row => {
      return { 'Note Content': row };
    });
    
    // Convert to CSV
    const csv = Papa.unparse(csvData);
    
    // Create a download link and trigger it
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('CSV export error:', error);
    throw new Error('Failed to export CSV');
  }
}

// Export to Markdown
export function exportToMarkdown(content: any, filename: string): void {
  try {
    const markdown = jsonToMarkdown(content);
    
    // Create a download link and trigger it
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Markdown export error:', error);
    throw new Error('Failed to export Markdown');
  }
}

// Main export function
export async function exportContent(
  content: any, 
  format: 'pdf' | 'docx' | 'csv' | 'markdown', 
  filename: string
): Promise<void> {
  switch (format) {
    case 'pdf':
      await exportToPdf(content, filename);
      break;
    case 'docx':
      await exportToDocx(content, filename);
      break;
    case 'csv':
      exportToCsv(content, filename);
      break;
    case 'markdown':
      exportToMarkdown(content, filename);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}