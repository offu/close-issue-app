import { createRobot } from 'probot'
import { IssuesCreateCommentParams, IssuesEditParams } from '@octokit/rest'
import * as path from 'path'
import app = require('../src/robot')
import payload from './fixtures/issues.event.json'

describe('robot', () => {
  let robot
  let github

  beforeEach(() => {
    robot = createRobot(null)
    app(robot)
    github = {
      issues: {
        createComment: jest.fn().mockResolvedValue(null),
        edit: jest.fn().mockResolvedValue(null)
      }
    }
    robot.auth = () => Promise.resolve(github)
  })

  describe('robot deal with issues', () => {
    it('close issue', async () => {
      await robot.receive(payload)
      const params = {
        owner: 'baxterthehacker',
        repo: 'public-repo',
        number: 2
      }
      const createCommentParams: IssuesCreateCommentParams = { ...params, body: 'test' }
      const editIssueParams: IssuesEditParams = { ...params, state: 'closed' }
      expect(github.issues.createComment).toHaveBeenCalledWith(createCommentParams)
      expect(github.issues.edit).toHaveBeenCalledWith(editIssueParams)
    })
  })
})
