import ProjectCard from "./ProjectCard";
//this is the project grid props interface, it is used to define the structure of the project grid props
interface ProjectGridProps {
  //this is the projects array, it is used to define the projects array
  projects: Array<{
    id: string;
    name: string;
    description: string;
    tags: string[];
    languages: string[];
    views: number;
    repoUrl?: string | null;
    demoUrl?: string | null;
    screenshots: string[];
    createdAt: string;
    author: {
      id: string;
      name: string | null;
      username: string | null;
      image: string | null;
    };
    _count: {
      likes: number;
      comments: number;
    };
  }>;
  emptyMessage?: string;
}
//this is the project grid component, it is used to display the project grid which is projects from either the home page or the explore page
export default function ProjectGrid({
  projects,
  emptyMessage = "No projects found",
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <p className="text-zinc-500 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
