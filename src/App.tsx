import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { FlagsTable } from "@/components/FlagsTable"
import { NewFlagModal } from "@/components/NewFlagModal"
import { useToast } from "@/components/ui/toast"
import type { Environment, FlagsData } from "@/types/flags"
import { Clock, AlertCircle } from "lucide-react"

// Configure your GitHub repository here
const GITHUB_REPO_OWNER = "polukovy"
const GITHUB_REPO_NAME = "feature-flag-service"

function App() {
  const [environment, setEnvironment] = useState<Environment>(() => {
    const stored = localStorage.getItem("selectedEnvironment") as Environment | null
    return stored || "dev"
  })
  const [flagsData, setFlagsData] = useState<FlagsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newFlagModalOpen, setNewFlagModalOpen] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    localStorage.setItem("selectedEnvironment", environment)
  }, [environment])

  useEffect(() => {
    const fetchFlags = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/flags/${environment}.json`)

        if (!response.ok) {
          throw new Error(`Failed to load flags: ${response.statusText}`)
        }

        const data: FlagsData = await response.json()

        // Validate JSON structure
        if (!data.environment || !Array.isArray(data.flags)) {
          throw new Error("Invalid JSON structure")
        }

        setFlagsData(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setError(message)
        addToast({
          title: "Error loading flags",
          description: message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFlags()
  }, [environment, addToast])

  const handleOpenJSON = () => {
    window.open(`/flags/${environment}.json`, "_blank", "noopener,noreferrer")
  }

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    if (diffMins > 0) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`
    return "just now"
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar
          environment={environment}
          onEnvironmentChange={setEnvironment}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNewFlagClick={() => setNewFlagModalOpen(true)}
          onOpenJSON={handleOpenJSON}
        />

        <main className="flex-1 p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading flags...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="border border-destructive bg-destructive/10 rounded-lg p-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive mb-1">
                  Error Loading Flags
                </h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                {error.includes("Failed to load") && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Make sure the flags file exists at{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">
                      public/flags/{environment}.json
                    </code>
                  </p>
                )}
              </div>
            </div>
          )}

          {!loading && !error && flagsData && (
            <>
              {flagsData.flags.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg mb-2">No flags found for this environment.</p>
                  <p className="text-sm">
                    Click "New Flag" to add your first feature flag.
                  </p>
                </div>
              ) : (
                <FlagsTable flags={flagsData.flags} searchQuery={searchQuery} />
              )}

              {/* Footer */}
              <div className="mt-8 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Updated {getTimeSince(flagsData.updatedAt)}
                  </span>
                </div>
                <div>
                  {flagsData.flags.length} flag{flagsData.flags.length !== 1 ? "s" : ""} in {environment.toUpperCase()}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <NewFlagModal
        open={newFlagModalOpen}
        onOpenChange={setNewFlagModalOpen}
        environment={environment}
        repoOwner={GITHUB_REPO_OWNER}
        repoName={GITHUB_REPO_NAME}
      />
    </div>
  )
}

export default App
