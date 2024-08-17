'use client';

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { Divide, ImagePlay, LogOut } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';

export default function Header() {
  const { isLoaded, user, isSignedIn } = useUser();

  return (
    <>
      <div className="bg-base-100 py-6 shadow-lg flex items-center">
        <div className="w-72 flex justify-center">
          <ImagePlay size={36} className="text-blue-400" />
        </div>
        <div className="flex justify-between px-10 items-center w-full">
          <div className="pl-8">
            <h1 className="font-extrabold text-3xl text-slate-300">Imagenary AI</h1>
          </div>
          {/* if it is loaded and is signed in then show the user else if it is loaded and not signed in then show the signin button */}
          {isLoaded ? (
            isSignedIn ? (
              <div className="flex gap-4 items-center">
                <div>
                  <p>{user.fullName}</p>
                </div>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button">
                    <Image
                      className="rounded-full"
                      src={user.imageUrl}
                      alt={user.firstName || 'user image'}
                      width={40}
                      height={40}
                    />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                    <li>
                      <SignOutButton>
                        <a className="text-red-500">
                          <LogOut /> Sign Out
                        </a>
                      </SignOutButton>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <SignInButton>
                <button className="btn btn-outline btn-primary">Sign in</button>
              </SignInButton>
            )
          ) : (
            <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
          )}
        </div>
      </div>
    </>
  );
}
