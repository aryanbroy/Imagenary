'use client';

import VideoCard from '@/components/VideoCard';
import { Video } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/videos');
        const data = res.data;
        setVideos(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);
  const onDownload = (url: string, title: string) => {
    const videoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${url}.mp4`;

    window.open(videoUrl, '_blank');

    // const link = document.createElement('a');
    // link.href = videoUrl;
    // link.download = `${title}.mp4`;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // console.log(url, title);
  };
  return (
    <div className="mt-4 space-y-4">
      <div>
        <h1 className="font-bold text-2xl">Videos</h1>
      </div>
      <div className="flex flex-wrap gap-8">
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          videos &&
          videos.map((video) => <VideoCard key={video.id} video={video} onDownload={onDownload} />)
        )}
      </div>
    </div>
  );
}
