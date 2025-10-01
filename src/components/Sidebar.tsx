import { Flag, BookOpen, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Flag className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Feature Flags</h1>
        </div>

        <nav className="space-y-2">
          <a
            href="#"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "bg-primary text-primary-foreground"
            )}
          >
            <Flag className="h-4 w-4" />
            <span className="font-medium">Feature Flags</span>
          </a>
          <a
            href="#"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <BookOpen className="h-4 w-4" />
            <span className="font-medium">Docs</span>
          </a>
          <a
            href="#"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Info className="h-4 w-4" />
            <span className="font-medium">About</span>
          </a>
        </nav>
      </div>
    </aside>
  )
}
