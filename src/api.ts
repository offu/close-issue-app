import { Context } from 'probot'
import { Buffer } from 'buffer'

export async function closeIssue (context: Context) {
  const params = {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    issue_number: context.payload.issue.number
  }
  await context.github.issues.update({
    ...params,
    state: 'closed'
  })
}

export async function createLabelIfNotExist (context, label: string) {
  try {
    const l = await context.github.issues.getLabel({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      name: label
    })
  } catch (e) {
    if (e.hasOwnProperty('status') && e.statusy === 404) {
      await context.github.issues.createLabel({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        name: label,
        color: 'aa1414'
      })
    } else {
      throw e
    }
  }
}

export async function addLabel (context: Context, label: string) {
  await createLabelIfNotExist(context, label)
  await context.github.issues.addLabels({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    number: context.payload.issue.number,
    labels: [label]
  })
}

export async function createComment (context: Context, comment: string) {
  const params = {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    number: context.payload.issue.number
  }
  await context.github.issues.createComment({
    body: comment,
    ...params
  })
}

export async function getContent (context: Context, path: string) {
  const params = {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name
  }
  const resp = await context.github.repos.getContents({
    path,
    ...params
  })
  return Buffer.from(resp.data[0].content, resp.data[0].encoding).toString('utf-8')
}
