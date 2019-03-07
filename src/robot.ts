import { Application } from 'probot'
import { parseConfig, shouldClose } from './parser'
import { closeIssue, createComment, getContent } from './api'
import { errorComment } from './models'
import { isString } from 'util'

export = (robot: Application) => {
  robot.on(['issues.opened', 'issues.reopened'], async context => {
    let remoteConfig: string | null = null
    try {
      remoteConfig = await getContent(context, '/.github/issue-close-app.yml')
    } catch (e) {
      console.error(e)
      return
    }
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
      await createComment(context, `${errorComment}
      \`\`\` log
      ${e.message}
      ${e.stack}
      \`\`\``)
      throw e
    }
  })
}
