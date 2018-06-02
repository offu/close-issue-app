import { isArray, isString } from 'util'

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
 * 判断一个 object 是不是 MatchConfig
 */
export function isMatchConfig (item: any): item is MatchConfig {
  if (!('description' in item
  && 'content' in item
  && isString(item.description)
  && isArray(item.content)
  && item.content.length > 0)) {
    return false
  }
  return item.content.every(isString)
}

/**
 * 判断一个 object 是不是 IssueConfig
 */
export function isIssueConfig (item: any): item is IssueConfig {
  if (!('label' in item
  && 'items' in item
  && isString(item.label)
  && isArray(item.items)
  && item.items.length > 0)) {
    return false
  }
  return item.items.every(isMatchConfig)
}
/**
 * 判断一个对象是不是 Config
 */
export function isConfig (item: any): item is Config {
  if (!('comment' in item
  && 'issues' in item
  && isString(item.comment)
  && isArray(item.issues)
  && item.issues.length > 0)) {
    return false
  }
  return item.issues.every(isIssueConfig)
}
