import React from 'react';
import Image from 'next/image';

interface Memory {
  id: string;
  image: string;
  caption: string;
  lottie?: string;
}

const memories: Memory[] = [
  // Example: { id: '1', image: '/assets/photo1.jpg', caption: 'Freda at the beach', lottie: '/assets/flourish1.json' }
];

const Timeline: React.FC = () => (
  <section className="w-full py-8 px-2 flex flex-col items-center">
    <h2 className="font-playfair text-2xl mb-4 text-gold">Memory Timeline</h2>
    <div className="flex overflow-x-auto gap-4 pb-4">
      {memories.map(memory => (
        <div key={memory.id} className="min-w-[220px] bg-cream rounded-lg shadow p-4 flex flex-col items-center">
          <Image src={memory.image} alt={memory.caption} width={160} height={160} className="rounded mb-2 object-cover" />
          <p className="font-poppins text-sm text-slate-700 mb-2">{memory.caption}</p>
          {memory.lottie && (
            <div className="w-12 h-12">
              {/* Lottie flourish here */}
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default Timeline;
