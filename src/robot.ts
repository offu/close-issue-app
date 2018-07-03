import { Application } from 'probot'
import { parseConfig, shouldClose } from './parser'
import { closeIssue, createComment, getContent } from './api'
import { errorComment } from './models'
import { isString } from 'util'

export = (robot: Application) => {
  robot.on(['issues.opened', 'issues.reopened'], async context => {
    let remoteConfig: null | string = null
    remoteConfig = await getContent(context, '/.github/issue-close-app.yml')
    try {
      if (!isString(remoteConfig)) {
        throw Error(`remote config is not a string:\n${remoteConfig}`)
      }
      const config = parseConfig(remoteConfig)
      const issueBody = context.payload.issue.body
      if (shouldClose(config, issueBody)) {
        await createComment(context, config.comment)
        await closeIssue(context)
      }
    } catch (e) {
      await createComment(context, `${errorComment}\n\`\`\` log\n${e.message}\n\`\`\``)
      throw e
    }
  })
}
