import ResetPasswordClient from '@/src/components/ResetPasswordClient';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading reset form...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
