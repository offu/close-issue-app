import { Context } from 'probot'

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
  return context.github.repos.getContent({
    path: `${path}.raw`,
    ...params
  })
}
