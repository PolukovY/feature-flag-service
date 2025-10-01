import { Moon, Sun, Search, GitPullRequest, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/contexts/ThemeContext"
import type { Environment } from "@/types/flags"

interface TopBarProps {
  environment: Environment
  onEnvironmentChange: (env: Environment) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onNewFlagClick: () => void
  onOpenJSON: () => void
}

export function TopBar({
  environment,
  onEnvironmentChange,
  searchQuery,
  onSearchChange,
  onNewFlagClick,
  onOpenJSON,
}: TopBarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="flex items-center gap-4 px-6 py-3">
        <h2 className="text-lg font-semibold">Feature Flags Viewer</h2>

        {/* Environment Switcher */}
        <div className="flex items-center gap-1 bg-muted rounded-md p-1">
          {(["dev", "uat", "prod"] as Environment[]).map((env) => (
            <button
              key={env}
              onClick={() => onEnvironmentChange(env)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                environment === env
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {env.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search flags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenJSON}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open JSON
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onNewFlagClick}
            className="gap-2"
          >
            <GitPullRequest className="h-4 w-4" />
            New Flag
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
