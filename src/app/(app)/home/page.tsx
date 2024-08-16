'use client';

import VideoCard from '@/components/VideoCard';
import React from 'react';

const mockVideo = {
  id: 'clzvqg43c0000kbif1evegzut',
  title: 'testing',
  description: 'testing desc',
  publicId: 'imagenary-videos/mvxsxx2audkowobhaj5j',
  originalSize: '574640',
  compressedSize: '451340',
  duration: 13.8,
  createdAt: new Date('2024-08-15 20:28:21.035'),
  updatedAt: new Date('2024-08-15 20:28:21.035'),
};

export default function Home() {
  const onDownload = (url: string, title: string) => {
    console.log(url, title);
  };
  return (
    <div className="mt-4 space-y-4">
      <div>
        <h1 className="font-bold text-2xl">Videos</h1>
      </div>
      <div>
        <VideoCard
          video={mockVideo}
          onDownload={() => onDownload(mockVideo.publicId, mockVideo.title)}
        />
      </div>
    </div>
  );
}
