import type { FeatureFlag, EvaluationContext, ContextRule } from "@/types/flags"

/**
 * Evaluates a single context rule against the provided context
 */
function evaluateRule(rule: ContextRule, context: EvaluationContext): boolean {
  const value = context[rule.field_name]

  if (value === undefined) {
    return false
  }

  switch (rule.type) {
    case "equals":
      return value === rule.field_value
    case "start_with":
      return value.startsWith(rule.field_value)
    default:
      return false
  }
}

/**
 * Evaluates a single feature flag with optional context
 * @param flag - The feature flag to evaluate
 * @param context - Optional evaluation context
 * @returns The evaluated boolean value of the flag
 */
export function evaluateFlag(
  flag: FeatureFlag,
  context?: EvaluationContext
): boolean {
  // If no context rules, return base featureValue
  if (!flag.featureContext || flag.featureContext.length === 0) {
    return flag.featureValue
  }

  // If context rules exist but no context provided, return base value
  if (!context) {
    return flag.featureValue
  }

  // All context rules must pass (AND logic)
  const allRulesPass = flag.featureContext.every((rule) =>
    evaluateRule(rule, context)
  )

  // If all rules pass, return featureValue, otherwise return opposite
  return allRulesPass ? flag.featureValue : !flag.featureValue
}

/**
 * Evaluates all flags with optional context
 * @param flags - Array of feature flags
 * @param context - Optional evaluation context
 * @returns Record mapping flag names to their evaluated boolean values
 */
export function evaluateAll(
  flags: FeatureFlag[],
  context?: EvaluationContext
): Record<string, boolean> {
  return flags.reduce(
    (acc, flag) => {
      acc[flag.featureName] = evaluateFlag(flag, context)
      return acc
    },
    {} as Record<string, boolean>
  )
}
