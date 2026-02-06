'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import PaymentSuccessClient from './PaymentSuccessClient';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center mt-12">Loading...</p>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
