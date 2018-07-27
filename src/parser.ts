import * as yaml from 'js-yaml'
import { BotConfig, isBotConfig, botConfigFactory } from './models'

/**
 * Parse the file according to the path into BotConfig
 */
export function parseConfig (content: string): BotConfig {
  const data = yaml.safeLoad(content)
  if (!isBotConfig(data)) {
    throw new Error('invalid config')
  } else {
    return botConfigFactory(data)
  }
}

export function shouldClose (botConfig: BotConfig, content: string): boolean {
  return !botConfig.issueConfigs.some((issueConfig) => {
    return issueConfig.content.every((issueContent) => {
      if (botConfig.caseSensitive) {
        return content.includes(issueContent)
      } else {
        return content.toLowerCase().includes(issueContent.toLowerCase())
      }
    })
  })
}
