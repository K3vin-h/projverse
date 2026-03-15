"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteProjectButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete project");
      }
    } catch {
      alert("Failed to delete project");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
