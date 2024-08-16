import React, { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { filesize } from 'filesize';
import { Video } from '@prisma/client';
import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary';
import { Download, FileMinus, FileText } from 'lucide-react';

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      format: 'jpg',
      assetType: 'video',
    });
  }, []);

  const getFullVideoUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  }, []);

  const getPreviewUrl = useCallback((publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ['e_preview:duration_15:max_seg_9:min_seg_dur_1'],
    });
  }, []);

  const formatSize = useCallback((size: number) => {
    return filesize(size);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute(s) and ${remainingSeconds} second(s)`;
  }, []);

  const compressedPercentage = () => {
    const originalSizeToNum = Number(video.originalSize);
    const compressedSizeToNum = Number(video.compressedSize);
    const percentageCompressed = Math.round(
      ((originalSizeToNum - compressedSizeToNum) / originalSizeToNum) * 100,
    );
    return percentageCompressed;
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <img src={getThumbnailUrl(video.publicId)} alt="Shoes" />
      </figure>
      <div className="card-body space-y-4">
        <div>
          <h2 className="card-title">{video.title}</h2>
          <p className="text-slate-400">{video.description}</p>
        </div>
        <div>
          <p className="text-slate-400">Uploaded {dayjs(video.updatedAt).fromNow()}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div>
              <FileText color="#6CB4EE" />
            </div>
            <div>
              <p className="font-bold text-slate-400">Original</p>
              <p className="text-sm text-slate-400">{formatSize(Number(video.originalSize))}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <FileMinus color="#6CB4EE" />
            </div>
            <div>
              <p className="font-bold text-slate-400">Compressed</p>
              <p className="text-sm text-slate-400">{formatSize(Number(video.compressedSize))}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center card-actions">
          <div>
            <span className="text-slate-400 font-semibold">
              Compression: {compressedPercentage()}%
            </span>
          </div>
          <div>
            <button className="btn btn-primary">
              <Download />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
