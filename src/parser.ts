import * as yaml from 'js-yaml'
import * as fs from 'fs'
import { isArray } from 'util'

export interface IssueItem {
  description: string,
  content: Array<string>
}

export interface Issue {
  label: string
  items: Array<IssueItem>
}

export interface Config {
  issues: Array<Issue>
  comment: string
}

export function isConfig (item: object): item is Config {
  return (item as Config).issues !== undefined
  && isArray((item as Config).issues)
  && (item as Config).issues.length > 0
  && (item as Config).comment !== undefined
}

export function parseConfig (path: string): Config {
  const data: yaml.DocumentLoadResult = yaml.safeLoad(fs.readFileSync(path, 'utf-8'))
  if (data === undefined || !isConfig(data)) {
    throw new Error('invalid config')
  } else {
    return data
  }
}

export function judge (config: Array<Issue>, issueLabel: Array<string>, content: string): boolean {
  let currentConfig: Issue | null = null
  for (const i of config) {
    for (const l of issueLabel) {
      if (i.label === l) {
        currentConfig = i // Only use one acceptable label
        break
      }
    }
  }
  // No config match
  if (currentConfig === null) {
    return false
  }
  for (const i of currentConfig.items) {
    for (const s of i.content) {
      if (content.indexOf(s) < 0) {
        return false
      }
    }
  }
  return true
}
