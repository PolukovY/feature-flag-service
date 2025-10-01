# Integration Guide

## Using Feature Flags in Your Application

### Basic Setup

1. **Import the evaluation functions:**

```typescript
import { evaluateFlag, evaluateAll } from '@/lib/evaluateFlags'
import type { FeatureFlag, FlagsData } from '@/types/flags'
```

2. **Fetch flags for your environment:**

```typescript
async function fetchFlags(environment: 'dev' | 'uat' | 'prod'): Promise<FlagsData> {
  const response = await fetch(`/flags/${environment}.json`)
  if (!response.ok) {
    throw new Error(`Failed to load flags: ${response.statusText}`)
  }
  return response.json()
}
```

### Example: React Component

```typescript
import { useState, useEffect } from 'react'
import { evaluateFlag } from '@/lib/evaluateFlags'
import type { FeatureFlag } from '@/types/flags'

function MyFeature() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])

  useEffect(() => {
    fetchFlags('prod').then(data => setFlags(data.flags))
  }, [])

  const newDashboardFlag = flags.find(f => f.featureName === 'new_dashboard')
  const isNewDashboardEnabled = newDashboardFlag
    ? evaluateFlag(newDashboardFlag, {
        domain: window.location.hostname
      })
    : false

  return (
    <div>
      {isNewDashboardEnabled ? (
        <NewDashboard />
      ) : (
        <OldDashboard />
      )}
    </div>
  )
}
```

### Example: Context-Based Evaluation

```typescript
// User context
const userContext = {
  email: "test@example.com",
  domain: "internal.company.com",
  role: "admin"
}

// Flag with context rules
const betaFeatureFlag: FeatureFlag = {
  featureName: "beta_feature",
  featureValue: true,
  featureDescription: "Beta feature for internal users",
  featureContext: [
    {
      type: "equals",
      field_name: "domain",
      field_value: "internal.company.com"
    }
  ]
}

// Evaluate
const isEnabled = evaluateFlag(betaFeatureFlag, userContext)
console.log(isEnabled) // true if domain matches
```

### Example: Evaluate All Flags

```typescript
import { evaluateAll } from '@/lib/evaluateFlags'

async function getAllFlagStates() {
  const data = await fetchFlags('prod')
  const context = {
    email: getCurrentUserEmail(),
    domain: window.location.hostname
  }

  const flagStates = evaluateAll(data.flags, context)

  console.log(flagStates)
  // {
  //   "new_dashboard": true,
  //   "analytics_module": false,
  //   "dark_mode": true
  // }

  return flagStates
}
```

### Example: Feature Flag Hook (React)

```typescript
import { useState, useEffect } from 'react'
import { evaluateFlag } from '@/lib/evaluateFlags'
import type { FeatureFlag, EvaluationContext } from '@/types/flags'

function useFeatureFlag(
  flagName: string,
  context?: EvaluationContext
): boolean {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    async function checkFlag() {
      const data = await fetchFlags('prod')
      const flag = data.flags.find(f => f.featureName === flagName)

      if (flag) {
        setIsEnabled(evaluateFlag(flag, context))
      }
    }

    checkFlag()
  }, [flagName, context])

  return isEnabled
}

// Usage
function MyComponent() {
  const isNewFeatureEnabled = useFeatureFlag('new_feature', {
    email: user.email
  })

  if (!isNewFeatureEnabled) {
    return null
  }

  return <NewFeature />
}
```

### Example: Caching Flags

```typescript
class FlagCache {
  private cache: Map<string, { data: FlagsData, timestamp: number }> = new Map()
  private ttl = 5 * 60 * 1000 // 5 minutes

  async getFlags(environment: string): Promise<FlagsData> {
    const cached = this.cache.get(environment)

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data
    }

    const data = await fetchFlags(environment as any)
    this.cache.set(environment, { data, timestamp: Date.now() })

    return data
  }

  clearCache() {
    this.cache.clear()
  }
}

const flagCache = new FlagCache()

// Usage
const flags = await flagCache.getFlags('prod')
```

### Example: Node.js/Server-Side

```typescript
import fs from 'fs/promises'
import path from 'path'
import { evaluateFlag } from './lib/evaluateFlags'

async function loadFlags(environment: string) {
  const filePath = path.join(__dirname, 'public', 'flags', `${environment}.json`)
  const content = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(content)
}

async function checkFeature(flagName: string, context?: any) {
  const data = await loadFlags('prod')
  const flag = data.flags.find(f => f.featureName === flagName)

  if (!flag) {
    return false
  }

  return evaluateFlag(flag, context)
}

// Usage in Express middleware
app.use(async (req, res, next) => {
  const isEnabled = await checkFeature('new_api', {
    domain: req.hostname
  })

  req.featureFlags = {
    newApi: isEnabled
  }

  next()
})
```

### Example: Testing Flags

```typescript
import { describe, it, expect } from 'vitest'
import { evaluateFlag } from '@/lib/evaluateFlags'
import type { FeatureFlag } from '@/types/flags'

describe('Feature Flag Evaluation', () => {
  it('should enable flag with matching context', () => {
    const flag: FeatureFlag = {
      featureName: 'test_flag',
      featureValue: true,
      featureDescription: 'Test flag',
      featureContext: [
        {
          type: 'equals',
          field_name: 'env',
          field_value: 'test'
        }
      ]
    }

    const result = evaluateFlag(flag, { env: 'test' })
    expect(result).toBe(true)
  })

  it('should disable flag with non-matching context', () => {
    const flag: FeatureFlag = {
      featureName: 'test_flag',
      featureValue: true,
      featureDescription: 'Test flag',
      featureContext: [
        {
          type: 'equals',
          field_name: 'env',
          field_value: 'test'
        }
      ]
    }

    const result = evaluateFlag(flag, { env: 'prod' })
    expect(result).toBe(false)
  })
})
```

### Best Practices

1. **Cache flag data** to avoid repeated fetches
2. **Use context wisely** - keep context fields simple and consistent
3. **Default to safe values** - if flag fetch fails, fall back to safe defaults
4. **Test flag behavior** - write tests for critical flag-dependent features
5. **Document context fields** - maintain a list of available context fields
6. **Version your flags** - use the `updatedAt` timestamp for cache invalidation
7. **Monitor flag usage** - track which flags are actually being evaluated

### Context Field Naming Conventions

Recommended context fields:

- `email` - User email address
- `domain` - Current domain/hostname
- `user_id` - User identifier
- `role` - User role (admin, user, etc.)
- `environment` - Runtime environment
- `version` - Application version
- `region` - Geographic region
- `tenant` - Multi-tenant identifier

### Error Handling

```typescript
async function safeEvaluateFlag(
  flagName: string,
  defaultValue: boolean = false,
  context?: EvaluationContext
): Promise<boolean> {
  try {
    const data = await fetchFlags('prod')
    const flag = data.flags.find(f => f.featureName === flagName)

    if (!flag) {
      console.warn(`Flag not found: ${flagName}`)
      return defaultValue
    }

    return evaluateFlag(flag, context)
  } catch (error) {
    console.error(`Error evaluating flag ${flagName}:`, error)
    return defaultValue
  }
}
```

### Performance Tips

1. **Fetch once, evaluate many** - Load all flags once and evaluate multiple times
2. **Use memoization** - Cache evaluation results for the same context
3. **Minimize context size** - Only include necessary fields in context
4. **Consider lazy loading** - Only load flags when needed
5. **Use Web Workers** - Offload flag evaluation to a worker thread for complex logic

## Advanced Patterns

### Feature Flag Provider (React Context)

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { FlagsData, EvaluationContext } from '@/types/flags'
import { evaluateAll } from '@/lib/evaluateFlags'

interface FlagContextType {
  flags: Record<string, boolean>
  loading: boolean
  error: Error | null
}

const FlagContext = createContext<FlagContextType>({
  flags: {},
  loading: true,
  error: null
})

export function FlagProvider({
  children,
  environment = 'prod',
  context
}: {
  children: React.ReactNode
  environment?: string
  context?: EvaluationContext
}) {
  const [flags, setFlags] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadFlags() {
      try {
        const response = await fetch(`/flags/${environment}.json`)
        const data: FlagsData = await response.json()
        const evaluated = evaluateAll(data.flags, context)
        setFlags(evaluated)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadFlags()
  }, [environment, context])

  return (
    <FlagContext.Provider value={{ flags, loading, error }}>
      {children}
    </FlagContext.Provider>
  )
}

export function useFlags() {
  return useContext(FlagContext)
}

export function useFlag(flagName: string): boolean {
  const { flags } = useFlags()
  return flags[flagName] ?? false
}

// Usage
function App() {
  return (
    <FlagProvider environment="prod" context={{ email: user.email }}>
      <MyApp />
    </FlagProvider>
  )
}

function MyFeature() {
  const isEnabled = useFlag('new_dashboard')
  return isEnabled ? <NewDashboard /> : <OldDashboard />
}
```

This integration guide provides comprehensive examples for using the feature flag system in various contexts and environments.
