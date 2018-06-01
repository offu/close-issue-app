import * as yaml from 'js-yaml'
import * as fs from 'fs'
import { isArray } from 'util'

/** 同一个 label 下包含的内容的配置 */
export interface MatchConfig {
  /** 对配置的描述 */
  description: string,
  /** 内容 */
  content: Array<string>
}

/** 用 label 区分的不同类型的 issue 的配置 */
export interface IssueConfig {
  /** 对应的 label */
  label: string
  /** 所包含的检查内容和描述 */
  items: Array<MatchConfig>
}
/** 最外层的 Config interface */
export interface Config {
  /** 用来记录所有的 issue 相关设置 */
  issues: Array<IssueConfig>
  /** 要关闭 github issue 时发的 comment */
  comment: string
}
/**
 * 判断一个对象是不是 Config
 */
export function isConfig (item: object): item is Config {
  return (item as Config).issues !== undefined
  && isArray((item as Config).issues)
  && (item as Config).issues.length > 0
  && (item as Config).comment !== undefined
}
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
