/**
 * Smart search helper that finds products with partial matches, word matches, and similar products
 */

/**
 * Calculate similarity score between two strings
 * Returns a score between 0 and 1
 */
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // One contains the other
  if (s2.includes(s1) || s1.includes(s2)) return 0.9;
  
  // Calculate word-based similarity
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  let matchingWords = 0;
  let totalWords = Math.max(words1.length, words2.length);
  
  words1.forEach(word1 => {
    if (words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
      matchingWords++;
    }
  });
  
  // Character-based similarity
  let charMatches = 0;
  const minLength = Math.min(s1.length, s2.length);
  for (let i = 0; i < minLength; i++) {
    if (s1[i] === s2[i]) charMatches++;
  }
  const charSimilarity = charMatches / Math.max(s1.length, s2.length);
  
  // Word similarity
  const wordSimilarity = matchingWords / totalWords;
  
  // Combined score
  return Math.max(charSimilarity * 0.3, wordSimilarity * 0.7);
}

/**
 * Check if product matches search query with flexible matching
 */
export function matchesSearch(item, searchQuery) {
  if (!searchQuery || !item || !item.name) return false;
  
  const query = searchQuery.toLowerCase().trim();
  const productName = item.name.toLowerCase().trim();
  
  // Remove Turkish characters for better matching
  const normalize = (str) => str
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c');
  
  const normalizedQuery = normalize(query);
  const normalizedName = normalize(productName);
  
  // Exact match or contains
  if (normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName)) {
    return true;
  }
  
  // Word-by-word matching
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
  const nameWords = normalizedName.split(/\s+/).filter(w => w.length > 0);
  
  // Check if all query words appear somewhere in the product name
  const allWordsMatch = queryWords.every(qWord => 
    nameWords.some(nWord => nWord.includes(qWord) || qWord.includes(nWord))
  );
  
  if (allWordsMatch && queryWords.length > 0) {
    return true;
  }
  
  // Similarity check (threshold: 0.3 means at least 30% similar)
  const similarity = calculateSimilarity(normalizedQuery, normalizedName);
  if (similarity >= 0.3) {
    return true;
  }
  
  // Check if any word from query matches any word in product (partial)
  const hasPartialMatch = queryWords.some(qWord => 
    nameWords.some(nWord => 
      nWord.includes(qWord) || qWord.includes(nWord)
    )
  );
  
  return hasPartialMatch;
}

/**
 * Search and rank products by relevance - SIMPLIFIED AND RELIABLE
 */
export function searchProducts(products, searchQuery) {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return products;
  }
  
  const query = searchQuery.toLowerCase().trim();
  if (query.length === 0) return products;
  
  // Simple normalization
  const normalize = (str) => {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
      .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/İ/g, 'i').replace(/Ğ/g, 'g').replace(/Ü/g, 'u')
      .replace(/Ş/g, 's').replace(/Ö/g, 'o').replace(/Ç/g, 'c');
  };
  
  const normalizedQuery = normalize(query);
  
  // Score and filter products - VERY AGGRESSIVE MATCHING
  const results = [];
  
  for (const item of products) {
    if (!item || !item.name) continue;
    
    const productName = String(item.name).toLowerCase().trim();
    const normalizedName = normalize(item.name);
    
    let score = 0;
    let matches = false;
    
    // 1. Exact match (highest priority)
    if (normalizedName === normalizedQuery || productName === query) {
      score = 100;
      matches = true;
    }
    // 2. Product name starts with query
    else if (normalizedName.startsWith(normalizedQuery) || productName.startsWith(query)) {
      score = 90;
      matches = true;
    }
    // 3. Product name contains query (MOST IMPORTANT - this should catch "bey" in "Beypazarı")
    else if (normalizedName.includes(normalizedQuery) || productName.includes(query)) {
      score = 80;
      matches = true;
    }
    // 4. Word matching - check if any word in query appears in product name (even single words)
    else {
      const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0); // Changed: allow single chars
      const nameWords = normalizedName.split(/\s+/).filter(w => w.length > 0);
      
      if (queryWords.length > 0) {
        // Check if ANY word from query appears ANYWHERE in product name
        const matchingWords = queryWords.filter(qWord => {
          // Direct word match
          if (nameWords.includes(qWord)) return true;
          // Any word contains the query word
          if (nameWords.some(nWord => nWord.includes(qWord))) return true;
          // Product name as whole contains query word
          if (normalizedName.includes(qWord)) return true;
          return false;
        }).length;
        
        if (matchingWords > 0) {
          score = 60 + (matchingWords / queryWords.length) * 20;
          matches = true;
        }
      }
      
      // 5. ANY character sequence matching - very loose
      if (!matches && query.length >= 2) {
        // Check if product name contains query as substring (even if not normalized)
        if (productName.includes(query) || normalizedName.includes(normalizedQuery)) {
          score = 50;
          matches = true;
        }
        // Check if any 3+ character substring of query appears in product name
        else if (query.length >= 3) {
          for (let i = 0; i <= query.length - 3; i++) {
            const substring = query.substring(i, i + 3);
            if (normalizedName.includes(substring) || productName.includes(substring)) {
              score = 40;
              matches = true;
              break;
            }
          }
        }
      }
    }
    
    if (matches && score > 0) {
      results.push({ ...item, _searchScore: score });
    }
  }
  
  // Sort by score (highest first)
  results.sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0));
  
  return results;
}

