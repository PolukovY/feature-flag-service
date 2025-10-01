import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy } from "lucide-react"
import type { Environment } from "@/types/flags"
import { useState } from "react"
import { useToast } from "@/components/ui/toast"

interface NewFlagModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  environment: Environment
  repoOwner?: string
  repoName?: string
}

const FLAG_EXAMPLE = `{
  "featureName": "new_feature",
  "featureValue": true,
  "featureDescription": "Description of your new feature",
  "featureContext": [
    {
      "type": "equals",
      "field_name": "domain",
      "field_value": "example.com"
    }
  ]
}`

export function NewFlagModal({
  open,
  onOpenChange,
  environment,
  repoOwner = "YOUR_GITHUB_USERNAME",
  repoName = "YOUR_REPO_NAME",
}: NewFlagModalProps) {
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()

  const githubEditUrl = `https://github.com/${repoOwner}/${repoName}/edit/main/public/flags/${environment}.json`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(FLAG_EXAMPLE)
      setCopied(true)
      addToast({
        title: "Copied!",
        description: "Flag template copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      addToast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleOpenGitHub = () => {
    window.open(githubEditUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Feature Flag</DialogTitle>
          <DialogDescription>
            Create a new flag via GitHub PR workflow for the <strong>{environment.toUpperCase()}</strong> environment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">How it works:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Copy the flag template below</li>
              <li>Click "Open in GitHub" to edit the flags file</li>
              <li>Paste and customize your flag in the JSON editor</li>
              <li>Create a pull request for review</li>
            </ol>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Flag Template:</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
              <code>{FLAG_EXAMPLE}</code>
            </pre>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2">Context Rules (optional):</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">equals</code> - Exact match
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">start_with</code> - Starts with match
              </li>
              <li>Remove <code className="bg-background px-1 py-0.5 rounded">featureContext</code> if not needed</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="default"
              onClick={handleOpenGitHub}
              className="flex-1 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
