// components/ui/login-button.tsx
'use client';

import * as React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { IconGoogle, IconSpinner } from '@/components/ui/icons';

interface GoogleLoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export function GoogleLoginButton({
  text = 'Continue with Google',
  className,
  ...props
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/callback` }
    });
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`inline-flex items-center justify-center relative shrink-0 ring-offset-2 ring-offset-bg-300 ring-accent-main-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none text-text-200 transition-all font-styrene active:bg-bg-400 hover:bg-bg-500/40 hover:text-text-100 h-11 rounded-[0.6rem] px-5 min-w-[6rem] active:scale-[0.985] whitespace-nowrap bg-white/90 gap-2 font-medium w-full border-0.5 border-border-400 hover:bg-white hover:border-border-300 ${className}`}
      data-testid="login-with-google"
      {...props}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : (
        <IconGoogle />
      )}
      {text}
    </button>
  );
}
