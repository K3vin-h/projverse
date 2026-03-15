import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProjectForm from "@/components/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Submit New Project</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Share your project with the developer community.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#111116] p-8">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
