'use client';

import { SignUp, useSignIn, useSignUp } from '@clerk/nextjs';
import { GoogleImg } from '../../sign-in/[[...sign-in]]/page';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { signUp, isLoaded, setActive } = useSignUp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();

  const signUpWithEmail = async () => {
    setPendingVerification(true);
    try {
      await signUp?.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      await signUp?.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const verifyEmail = async () => {
    if (!setActive || !code) {
      console.log('something is wrong here');
      return;
    }
    try {
      const res = await signUp?.attemptEmailAddressVerification({
        code,
      });

      if (res?.status !== 'complete') {
        console.log(res?.status);
        return;
      }

      if (res?.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      router.push('/sign-in');
    }
  };

  const signUpWithGoogle = async () => {
    try {
      await signUp?.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/home',
        continueSignUp: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center container h-screen items-center">
      <div className="py-20 px-10 shadow-xl space-y-8 w-5/12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-center">Create an account</h1>
          <p className="text-center text-slate-400">Sign up to Imagenary AI!</p>
        </div>
        <div>
          {pendingVerification ? (
            <form className="space-y-4" onSubmit={verifyEmail}>
              <label className="input input-bordered flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 L 4 8 L 4 22 L 20 22 L 20 8 L 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 12 13 C 13.1 13 14 13.9 14 15 C 14 16.1 13.1 17 12 17 C 10.9 17 10 16.1 10 15 C 10 13.9 10.9 13 12 13 z"></path>
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Verification Code"
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                />
              </label>
              <div>
                <button type="submit" className="font-semibold text-lg btn btn-primary w-full">
                  Verify
                </button>
                <button className="btn btn-link p-0" onClick={() => setPendingVerification(false)}>
                  Go back to sign up page
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-center items-center">
                <button
                  onClick={signUpWithGoogle}
                  className="btn btn-block btn-outline text-lg flex gap-6"
                >
                  <GoogleImg /> Continue with Google
                </button>
              </div>
              <form className="space-y-4 mt-8" onSubmit={signUpWithEmail}>
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                  </svg>
                  <input
                    type="text"
                    className="grow"
                    placeholder="First name"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                  />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                  </svg>
                  <input
                    type="text"
                    className="grow"
                    placeholder="Last name"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                  />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input
                    type="text"
                    className="grow"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="password"
                    className="grow"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </label>

                <div className="space-y-1">
                  <button type="submit" className="font-semibold text-lg btn btn-primary w-full">
                    Sign Up
                  </button>
                  <div>
                    <Link className="link link-primary" href={'/sign-in'}>
                      Already have an account? Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
