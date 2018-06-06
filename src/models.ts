import { isArray, isString } from 'util'

/** Config for issue matching. */
export interface IssueConfig {
  /** content to match */
  content: Array<string>
}

/** Config for the issue bot */
export interface BotConfig {
  /** One BotConfig can include several IssueConfig for different issues */
  issueConfigs: Array<IssueConfig>
  /** Comment that will be sent if an issue is judged to be closed */
  comment: string
}

/**
 * check something if it is an IssueConfig
 */
export function isIssueConfig (item: any): item is IssueConfig {
  if (!('content' in item
  && isArray(item.content))) {
    return false
  }
  return item.content.every(isString)
}
/**
 * check something if it is a BotConfig
 */
export function isBotConfig (item: any): item is BotConfig {
  if (!('comment' in item
  && 'issueConfigs' in item
  && isString(item.comment)
  && isArray(item.issueConfigs))) {
    return false
  }
  return item.issueConfigs.every(isIssueConfig)
}
