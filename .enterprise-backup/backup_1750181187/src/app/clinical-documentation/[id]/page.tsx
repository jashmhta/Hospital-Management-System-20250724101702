import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';


import { DocumentViewer } from '../../../components/clinical-documentation/document-viewer';
import { authOptions } from '../../../lib/auth';
export default async const _DocumentViewPage = ({
  params;
}: {id: string 
}) {
  // Get session
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  \1 {\n  \2{
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-6">;
      <Suspense fallback={<div>Loading document...</div>}>;
        <DocumentViewer documentId={params.id} />
      </Suspense>
    </div>
  );
