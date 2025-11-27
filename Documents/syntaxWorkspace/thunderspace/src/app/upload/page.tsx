import { UploadForm } from "@/components/features/UploadForm"
import { AuthGuard } from "@/components/features/AuthGuard"

export default function UploadPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <AuthGuard>
        <UploadForm />
      </AuthGuard>
    </div>
  )
}
