import { isArray, isString } from 'util'

/** 用于 issue 的配置 */
export interface IssueConfig {
  /** 所包含的检查内容 */
  items: Array<string>
}

/** 最外层的 Config interface */
export interface Config {
  /** 用来记录所有的 issue 相关设置 */
  issues: Array<IssueConfig>
  /** 要关闭 github issue 时发的 comment */
  comment: string
}

/**
 * 判断一个 object 是不是 IssueConfig
 */
export function isIssueConfig (item: any): item is IssueConfig {
  if (!('items' in item
  && isArray(item.items))) {
    return false
  }
  return item.items.every(isString)
}
/**
 * 判断一个对象是不是 Config
 */
export function isConfig (item: any): item is Config {
  if (!('comment' in item
  && 'issues' in item
  && isString(item.comment)
  && isArray(item.issues))) {
    return false
  }
  return item.issues.every(isIssueConfig)
}
