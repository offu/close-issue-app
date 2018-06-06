import { isArray, isString } from 'util'

/** Config for issue matching. */
export interface IssueConfig {
  /** content to match */
  items: Array<string>
}

/** Config for the issue bot */
export interface BotConfig {
  /** One BotConfig can include several IssueConfig for different issues */
  issueConfigArray: Array<IssueConfig>
  /** Comment that will be pushed if an issue is judged to be closed */
  comment: string
}

/**
 * check something if it is an IssueConfig
 */
export function isIssueConfig (item: any): item is IssueConfig {
  if (!('items' in item
  && isArray(item.items))) {
    return false
  }
  return item.items.every(isString)
}
/**
 * check something if it is a BotConfig
 */
export function isBotConfig (item: any): item is BotConfig {
  if (!('comment' in item
  && 'issueConfigArray' in item
  && isString(item.comment)
  && isArray(item.issueConfigArray))) {
    return false
  }
  return item.issueConfigArray.every(isIssueConfig)
}
