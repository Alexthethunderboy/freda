/**
 * Unlearn Archive API Client
 * This client provides a standardized way to fetch content from unlearn-archive.vercel.app
 */

export interface UnlearnArchivePost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  published_at: string;
  author: string;
  category: string;
  slug: string;
}

export interface UnlearnArchiveActivism {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'urgent' | 'completed';
  goal: number;
  current: number;
  type: string;
  link: string;
}

const BASE_URL = 'https://unlearn-archive.vercel.app/api';

class UnlearnAPI {
  private async fetcher<T>(endpoint: string): Promise<T | null> {
    try {
      // In a real scenario, this would call the actual API
      // For now, we'll try to fetch and return mock data if it fails
      const resp = await fetch(`${BASE_URL}${endpoint}`, {
        next: { revalidate: 3600 } // Cache for 1 hour
      });

      if (!resp.ok) throw new Error(`API Error: ${resp.status}`);
      return await resp.json() as T;
    } catch (err) {
      console.warn(`[UnlearnAPI] Failed to fetch ${endpoint}:`, err);
      return null;
    }
  }

  async getLatestPosts(): Promise<UnlearnArchivePost[]> {
    const data = await this.fetcher<UnlearnArchivePost[]>('/posts');
    return data || [
      {
        id: '1',
        title: 'The Architecture of Anxiety',
        excerpt: 'Unlearning productivity as a function of time...',
        published_at: '2026-01-02',
        author: 'Alex',
        category: 'Philosophy',
        slug: 'architecture-anxiety'
      }
    ];
  }

  async getActivismLedger(): Promise<UnlearnArchiveActivism[]> {
    const data = await this.fetcher<UnlearnArchiveActivism[]>('/activism');
    return data || [
       {
        id: '1',
        type: "Petition",
        title: "Reform Local Drug Policy",
        description: "Collecting 5,000 signatures to present to the state assembly...",
        current: 4230,
        goal: 5000,
        status: "urgent",
        link: "https://unlearn-archive.vercel.app/petitions/drug-policy"
      }
    ];
  }
}

export const unlearnApi = new UnlearnAPI();
