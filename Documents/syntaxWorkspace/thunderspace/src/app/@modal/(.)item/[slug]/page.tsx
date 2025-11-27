'use client';

import { useRouter } from 'next/navigation';
import { RichPreviewModal } from '@/components/features/RichPreviewModal';
// import { getKnowledgeItem } from '@/lib/sanity-utils';
import { useEffect, useState } from 'react';

export default function ItemModal({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { slug } = await params;
      // Mock data
      setItem({ title: 'Mock Item', summary: 'This is a mock item.', topics: [], slug: { current: slug } });
      // const data = await getKnowledgeItem(slug);
      // setItem(data);
    }
    fetchData();
  }, [params]);

  if (!item) return null;

  return (
    <RichPreviewModal 
      item={item} 
      onClose={() => router.back()} 
    />
  );
}
