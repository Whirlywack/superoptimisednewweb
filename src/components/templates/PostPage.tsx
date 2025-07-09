'use client';

import React from 'react';
import { HomepageNavigation } from './Homepage/HomepageNavigation';
import { HomepageFooter } from './Homepage/HomepageFooter';
import { XPToastProvider } from './Homepage/XPToastProvider';
import { PostHeader } from './PostPage/PostHeader';
import { PostContent } from './PostPage/PostContent';
import { PostNavigation } from './PostPage/PostNavigation';

export function PostPage() {
  return (
    <XPToastProvider>
      <div className="flex min-h-screen flex-col bg-off-white">
        <HomepageNavigation />
        <main className="flex-1">
          <PostHeader />
          <PostContent />
          <PostNavigation />
        </main>
        <HomepageFooter />
      </div>
    </XPToastProvider>
  );
}