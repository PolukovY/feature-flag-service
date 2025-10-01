export type Environment = "dev" | "uat" | "prod"

export interface ContextRule {
  type: "equals" | "start_with"
  field_name: string
  field_value: string
}

export interface FeatureFlag {
  featureName: string
  featureValue: boolean
  featureDescription: string
  featureContext?: ContextRule[]
}

export interface FlagsData {
  environment: Environment
  updatedAt: string
  flags: FeatureFlag[]
}

export interface EvaluationContext {
  [key: string]: string
}
