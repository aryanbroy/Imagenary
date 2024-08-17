'use client';

import { SignUp, useSignIn, useSignUp } from '@clerk/nextjs';
import { GoogleImg } from '../../sign-in/[[...sign-in]]/page';
import Link from 'next/link';

export default function Page() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const { signIn } = useSignIn();

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
        <div className="flex justify-center items-center">
          <button
            onClick={signUpWithGoogle}
            className="btn btn-block btn-outline text-lg flex gap-6"
          >
            <GoogleImg /> Continue with Google
          </button>
        </div>
        <div>
          <form className="space-y-4">
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
              <input type="text" className="grow" placeholder="Email" />
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
              <input type="password" className="grow" placeholder="Password" />
            </label>

            <div className="space-y-1">
              <button type="submit" className="btn btn-primary w-full">
                Sign Up
              </button>
              <div>
                <Link className="link link-primary" href={'/sign-in'}>
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
