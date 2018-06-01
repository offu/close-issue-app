import * as yaml from 'js-yaml'
import * as fs from 'fs'
import { Config, isConfig, IssueConfig } from './models'

/**
 * 用来读取配置文件
 */
export function parseConfig (path: string): Config {
  const data: yaml.DocumentLoadResult = yaml.safeLoad(fs.readFileSync(path, 'utf-8'))
  if (data === undefined || !isConfig(data)) {
    throw new Error('invalid config')
  } else {
    return data
  }
}
/**
 * 根据 label 匹配 IssueConfig
 */
export function matchIssueConfig (issueConfigArray: Array<IssueConfig>, issueLabelArray: Array<string>): IssueConfig | null {
  let result: IssueConfig | null = null
  issueConfigArray.some((issueConfig: IssueConfig) => {
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
/**
 * 如果 content 中包含了所有的 issueConfig 的 item 则返回 true，否则返回 false
 */
export function judge (issueConfig: IssueConfig | null, content: string): boolean {
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
