import { Robot } from 'probot'
import { parseConfig, shouldClose } from './parser'
import { closeIssue, createComment, getContent } from './api'
import { isString } from 'util'

export = (robot: Robot) => {
  robot.on(['issues.opened', 'issues.reopened'], async context => {
    const remoteConfig = await getContent(context, '/issue.bot.yml')
    if (!isString(remoteConfig)) {
      throw Error(`remote config is not a string:\n${remoteConfig}`)
    }
    const config = parseConfig(remoteConfig)
    const issueBody = context.payload.issue.body
    if (shouldClose(config, issueBody)) {
      await createComment(context, config.comment)
      await closeIssue(context)
    }
  })
}
