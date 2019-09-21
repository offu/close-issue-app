import { Application } from 'probot'
import { isString } from 'util'
import { addLabel, closeIssue, createComment, getContent } from './api'
import { errorComment } from './models'
import { parseConfig, shouldClose } from './parser'

export = (robot: Application) => {
  robot.on(['issues.opened', 'issues.reopened'], async context => {
    let remoteConfig: string | null = null
    try {
      remoteConfig = await getContent(context, '/.github/issue-close-app.yml')
    } catch (e) {
      if (e.hasOwnProperty('code') && e.code === 404) {
        // config file from this repo may not be found
        // ignore this kind of error
        console.error(e)
        return
      } else {
        throw e
      }
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
        if (config.label) {
          await addLabel(context, config.label)
        }
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
