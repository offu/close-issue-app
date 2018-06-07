import { Context } from 'probot'
import { Buffer } from 'buffer'

export async function closeIssue (context: Context) {
  const params = {
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    number: context.payload.issue.number
  }
  await context.github.issues.edit({
    ...params,
    state: 'closed'
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
  const resp = await context.github.repos.getContent({
    path,
    ...params
  })
  return Buffer.from(resp.data.content, resp.data.encoding).toString('utf-8')
}
