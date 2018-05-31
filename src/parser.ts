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

export function matchIssueConfig (issueConfigArray: Array<Issue>, issueLabelArray: Array<string>): Issue | null {
  let result: Issue | null = null
  issueConfigArray.some((issueConfig: Issue) => {
    for (const label of issueLabelArray) {
      if (issueConfig.label === label) {
        result = issueConfig
        return true
      }
    }
    return false
  })
  return result
}

export function judge (issueConfig: Issue | null, content: string): boolean {
  if (issueConfig === null) {
    return false
  }
  for (const i of issueConfig.items) {
    for (const s of i.content) {
      if (!content.includes(s)) {
        return false
      }
    }
  }
  return true
}
