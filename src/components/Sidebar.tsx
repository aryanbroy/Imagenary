'use client';

import { ImageUp, SquarePlay, Upload } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Sidebar() {
  const pathName = usePathname();

  useEffect(() => {
    const convertUrl = pathName?.split('/');
    const requiredBtn = document.getElementById(convertUrl[1]);
    if (requiredBtn) {
      requiredBtn.style.backgroundColor = '#318CE7';
      requiredBtn.style.color = 'black';
    }

    return () => {
      if (requiredBtn) {
        requiredBtn.style.backgroundColor = 'transparent';
        requiredBtn.style.color = 'white';
      }
    };
  }, [pathName]);

  return (
    <div className="flex flex-col gap-4 shadow-lg bg-base-100 h-screen pt-4">
      <Link href="/home" className="flex justify-center items-center px-4">
        <button id="home" className="btn btn-wide btn-ghost text-lg flex justify-start gap-4">
          <SquarePlay /> Videos
        </button>
      </Link>
      <Link href="/social-share" className="flex justify-center items-center px-4">
        <button
          id="social-share"
          className="btn btn-wide btn-ghost text-lg flex justify-start gap-4"
        >
          <ImageUp /> Image Converter
        </button>
      </Link>
      <Link href="/video-upload" className="flex justify-center items-center px-4">
        <button
          id="video-upload"
          className="btn btn-wide btn-ghost text-lg flex justify-start gap-4"
        >
          <Upload /> Upload Video
        </button>
      </Link>
    </div>
  );
}
