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
  comment: string,
  /** whether the keywords are case-sensitive */
  caseInsensitive?: boolean
  /** the label that will be added when the bot close an issue */
  label?: string
}

/**
 * check something if it is an IssueConfig
 */
export function isIssueConfig (item: any): item is IssueConfig {
  if (!('content' in item
  && Array.isArray(item.content))) {
    return false
  }
  return item.content.every((i) => {
    return typeof i === 'string'
  })
}
/**
 * check something if it is a BotConfig
 */
export function isBotConfig (item: any): item is BotConfig {
  if (!(item !== null
  && typeof item === 'object'
  && 'comment' in item
  && 'issueConfigs' in item
  && typeof item.comment === 'string'
  && Array.isArray(item.issueConfigs))) {
    return false
  }
  return item.issueConfigs.every(isIssueConfig)
}

export const errorComment: string = 'The app gets an error. :('
