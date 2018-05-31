import { Robot, Context } from 'probot'
import { parseConfig, judge, matchIssueConfig } from './parser'

let configPath = process.env.WEROBOT_BOT_CONFIG_PATH
if (configPath === undefined) {
  throw new Error("Can't get WEROBOT_BOT_CONFIG_PATH")
}
const config = parseConfig(configPath)

export = (robot: Robot) => {
  robot.on('issues.opened', async context => {
    if (context.payload.issue.labels.length === 0) {
      await closeIssue(context)
      return
    }
    let labels: Array<string> = []
    for (const l of context.payload.issue.labels) {
      labels.push(l.name)
    }
    const issueBody = context.payload.issue.body
    if (!judge(matchIssueConfig(config.issues, labels), issueBody)) {
      await closeIssue(context)
      return
    }
  })
}
/**
 * 评论并关闭对应 issue
 * @param  {Context} context
 */
async function closeIssue (context: Context) {
  const params = {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    number: context.payload.issue.number
  }
  await context.github.issues.createComment({
    body: config.comment,
    ...params
  })
  await context.github.issues.edit({
    ...params,
    state: 'closed'
  })
}
