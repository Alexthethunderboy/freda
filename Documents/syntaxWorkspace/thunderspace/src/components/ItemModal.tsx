'use client';

import { useRouter } from 'next/navigation';
import { RichPreviewModal } from './features/RichPreviewModal';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ItemModal({ item }: { item: any }) {
  const router = useRouter();
  return (
    <RichPreviewModal 
      item={item} 
      onClose={() => router.back()} 
    />
  );
}
