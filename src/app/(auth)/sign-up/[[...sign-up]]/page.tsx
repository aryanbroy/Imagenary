'use client';

import { useSignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';

const inputsSchema = z.object({
  firstName: z.string().min(3, { message: 'Firstname must be at least 3 characters long' }),
  lastName: z.string().min(3, { message: 'Lastname must be at least 3 characters long' }),
  email: z.string().email(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

function GoogleImg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="25px"
      height="25px"
      viewBox="0 0 48 48"
    >
      <path
        fill="#fbc02d"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#e53935"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4caf50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1565c0"
        d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  );
}

export default function Page() {
  const { signUp, isLoaded, setActive } = useSignUp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  useEffect(() => {
    setErrors({});
    try {
      const res = inputsSchema.parse({
        firstName,
        lastName,
        email,
        password,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          setErrors((prev) => ({ ...prev, [error.path[0]]: error.message }));
        });
      }
    }
  }, [firstName, lastName, email, password]);

  const signUpWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  const verifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
                {firstName.length > 0 && errors?.firstName && (
                  <span className="mt-0 text-red-500 text-sm">{errors?.firstName}</span>
                )}

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
                {lastName && errors?.lastName && (
                  <span className="mt-0 text-red-500 text-sm">{errors?.lastName}</span>
                )}

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
                {email && errors?.email && (
                  <span className="mt-0 text-red-500 text-sm">{errors?.email}</span>
                )}

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
                {password && errors?.password && (
                  <span className="mt-0 text-red-500 text-sm">{errors?.password}</span>
                )}

                <div className="space-y-1">
                  <button
                    disabled={Object.values(errors).length > 0}
                    type="submit"
                    className="font-semibold text-lg btn btn-primary w-full"
                  >
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
