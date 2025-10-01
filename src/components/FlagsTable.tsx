import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import type { FeatureFlag } from "@/types/flags"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FlagsTableProps {
  flags: FeatureFlag[]
  searchQuery: string
}

type FilterType = "all" | "enabled" | "disabled" | "has_context" | "no_context"
type SortField = "name" | "value" | "description"

const ITEMS_PER_PAGE = 25

export function FlagsTable({ flags, searchQuery }: FlagsTableProps) {
  const [filter, setFilter] = useState<FilterType>("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredAndSortedFlags = useMemo(() => {
    let result = [...flags]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (flag) =>
          flag.featureName.toLowerCase().includes(query) ||
          flag.featureDescription.toLowerCase().includes(query)
      )
    }

    // Apply filters
    switch (filter) {
      case "enabled":
        result = result.filter((f) => f.featureValue)
        break
      case "disabled":
        result = result.filter((f) => !f.featureValue)
        break
      case "has_context":
        result = result.filter((f) => f.featureContext && f.featureContext.length > 0)
        break
      case "no_context":
        result = result.filter((f) => !f.featureContext || f.featureContext.length === 0)
        break
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | boolean = ""
      let bVal: string | boolean = ""

      switch (sortField) {
        case "name":
          aVal = a.featureName
          bVal = b.featureName
          break
        case "value":
          aVal = a.featureValue
          bVal = b.featureValue
          break
        case "description":
          aVal = a.featureDescription
          bVal = b.featureDescription
          break
      }

      if (typeof aVal === "boolean" && typeof bVal === "boolean") {
        return sortDirection === "asc"
          ? Number(aVal) - Number(bVal)
          : Number(bVal) - Number(aVal)
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return 0
    })

    return result
  }, [flags, searchQuery, filter, sortField, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedFlags.length / ITEMS_PER_PAGE)
  const paginatedFlags = filteredAndSortedFlags.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Filter:</span>
        <div className="flex gap-1">
          {[
            { value: "all", label: "All" },
            { value: "enabled", label: "Enabled" },
            { value: "disabled", label: "Disabled" },
            { value: "has_context", label: "Has Context" },
            { value: "no_context", label: "No Context" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setFilter(f.value as FilterType)
                setCurrentPage(1)
              }}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortField === "name" && (
                      <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("value")}
                >
                  <div className="flex items-center gap-2">
                    Value
                    {sortField === "value" && (
                      <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-muted/70"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center gap-2">
                    Description
                    {sortField === "description" && (
                      <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Context Rules</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedFlags.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No flags found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedFlags.map((flag) => (
                  <tr key={flag.featureName} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-sm">{flag.featureName}</td>
                    <td className="px-4 py-3">
                      <Badge variant={flag.featureValue ? "success" : "secondary"}>
                        {flag.featureValue ? "Enabled" : "Disabled"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-md">
                      {flag.featureDescription}
                    </td>
                    <td className="px-4 py-3">
                      {flag.featureContext && flag.featureContext.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {flag.featureContext.map((ctx, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ctx.type === "equals" ? "=" : "^"} {ctx.field_name}={ctx.field_value}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedFlags.length)} of{" "}
            {filteredAndSortedFlags.length} flags
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
