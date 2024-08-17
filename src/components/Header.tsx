'use client';

import { ImagePlay } from 'lucide-react';
import React from 'react';

export default function Header() {
  return (
    <>
      <div className="bg-base-100 py-6 shadow-lg flex items-center">
        <div className="w-72 flex justify-center">
          <ImagePlay size={36} className="text-blue-400" />
        </div>
        <div className="pl-8">
          <h1 className="font-extrabold text-3xl text-slate-300">Imagenary AI</h1>
        </div>
      </div>
    </>
  );
}
