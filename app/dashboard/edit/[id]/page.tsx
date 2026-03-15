import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  if (project.authorId !== session.user.id) {
    redirect("/dashboard");
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
        <h1 className="text-2xl font-bold text-white">Edit Project</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Update your project details.
        </p>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#111116] p-8">
        <ProjectForm
          mode="edit"
          initialData={{
            id: project.id,
            name: project.name,
            description: project.description,
            repoUrl: project.repoUrl || "",
            demoUrl: project.demoUrl || "",
            docUrl: project.docUrl || "",
            tags: project.tags,
            languages: project.languages,
            screenshots: project.screenshots,
          }}
        />
      </div>
    </div>
  );
}
