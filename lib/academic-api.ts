// Types for academic paper API results
export interface PaperMetadata {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  publishedDate: string;
  source: string;
  doi?: string;
  citations?: number;
}

// ArXiv API
export async function searchArxiv(query: string, maxResults = 10): Promise<PaperMetadata[]> {
  try {
    const baseUrl = 'http://export.arxiv.org/api/query';
    const url = `${baseUrl}?search_query=${encodeURIComponent(query)}&max_results=${maxResults}`;
    
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse the XML response (simplified for example - would need proper XML parsing)
    // In production, use a proper XML parser or the arxiv npm package
    const papers: PaperMetadata[] = [];
    
    // This is a placeholder for actual XML parsing
    // In reality, you would use DOMParser in the browser or a library like xml2js in Node.js
    
    return papers;
  } catch (error) {
    console.error('Error searching ArXiv:', error);
    return [];
  }
}

// Semantic Scholar API
export async function searchSemanticScholar(query: string, limit = 10): Promise<PaperMetadata[]> {
  try {
    const baseUrl = 'https://api.semanticscholar.org/graph/v1/paper/search';
    const url = `${baseUrl}?query=${encodeURIComponent(query)}&limit=${limit}&fields=title,authors,abstract,url,year,citationCount,externalIds`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Semantic Scholar API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.data.map((paper: any) => ({
      id: paper.paperId,
      title: paper.title,
      authors: paper.authors.map((author: any) => author.name),
      abstract: paper.abstract || '',
      url: paper.url,
      publishedDate: paper.year ? paper.year.toString() : 'Unknown',
      source: 'Semantic Scholar',
      citations: paper.citationCount,
      doi: paper.externalIds?.DOI
    }));
  } catch (error) {
    console.error('Error searching Semantic Scholar:', error);
    return [];
  }
}

// CORE.ac.uk API (requires API key)
export async function searchCore(query: string, apiKey: string, limit = 10): Promise<PaperMetadata[]> {
  try {
    const baseUrl = 'https://core.ac.uk/api-v2/search';
    const url = `${baseUrl}?q=${encodeURIComponent(query)}&limit=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`CORE API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.data.map((paper: any) => ({
      id: paper.id,
      title: paper.title,
      authors: paper.authors?.map((author: any) => author.name) || [],
      abstract: paper.description || '',
      url: paper.downloadUrl || paper.url,
      publishedDate: paper.publishedDate || 'Unknown',
      source: 'CORE',
      doi: paper.doi
    }));
  } catch (error) {
    console.error('Error searching CORE:', error);
    return [];
  }
}

// Combined search function
export async function searchAcademicPapers(
  query: string, 
  sources: ('arxiv' | 'semanticscholar' | 'core')[] = ['arxiv', 'semanticscholar'],
  coreApiKey?: string,
  limit = 10
): Promise<PaperMetadata[]> {
  const searchPromises: Promise<PaperMetadata[]>[] = [];
  
  if (sources.includes('arxiv')) {
    searchPromises.push(searchArxiv(query, limit));
  }
  
  if (sources.includes('semanticscholar')) {
    searchPromises.push(searchSemanticScholar(query, limit));
  }
  
  if (sources.includes('core') && coreApiKey) {
    searchPromises.push(searchCore(query, coreApiKey, limit));
  }
  
  const results = await Promise.all(searchPromises);
  
  // Combine and de-duplicate results
  const combinedResults = results.flat();
  
  // Simple deduplication by title
  const uniqueResults = combinedResults.reduce((acc, current) => {
    const existingPaper = acc.find(paper => paper.title.toLowerCase() === current.title.toLowerCase());
    if (!existingPaper) {
      acc.push(current);
    }
    return acc;
  }, [] as PaperMetadata[]);
  
  return uniqueResults.slice(0, limit);
}