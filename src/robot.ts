import { Robot } from 'probot'
import { parseConfig, shouldClose } from './parser'
import { closeIssue, createComment } from './api'

const configPath = process.env.WEROBOT_BOT_CONFIG_PATH
if (configPath === undefined) {
  throw new Error("Can't get WEROBOT_BOT_CONFIG_PATH")
}

const config = parseConfig(configPath)

export = (robot: Robot) => {
  robot.on('issues.opened', async context => {
    const issueBody = context.payload.issue.body
    if (shouldClose(config, issueBody)) {
      await createComment(context, config.comment)
      await closeIssue(context)
    }
  })
}
