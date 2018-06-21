import { createRobot } from 'probot'
import { IssuesCreateCommentParams, IssuesEditParams, ReposGetContentParams } from '@octokit/rest'
import * as path from 'path'
import * as fs from 'fs'
import app = require('../src/robot')
import payload from './fixtures/issues.event.json'

describe('robot', () => {
  let robot
  let github
  const exampleConfig = fs.readFileSync(path.resolve(__dirname, '../example.config.yml'), 'utf-8')

  beforeEach(() => {
    robot = createRobot(null)
    app(robot)
    github = {
      issues: {
        createComment: jest.fn().mockResolvedValue(null),
        edit: jest.fn().mockResolvedValue(null)
      },
      repos: {
        getContent: jest.fn().mockResolvedValue({ data: {
          content: exampleConfig,
          encoding: 'utf-8'
        }})
      }
    }
    robot.auth = () => Promise.resolve(github)
  })

  describe('robot deal with issues', () => {
    it('invalid issue', async () => {
      await robot.receive(payload)
      const params = {
        owner: 'baxterthehacker',
        repo: 'public-repo',
        number: 2
      }
      const createCommentParams: IssuesCreateCommentParams = { ...params, body: 'test' }
      const editIssueParams: IssuesEditParams = { ...params, state: 'closed' }
      const getContentParams: ReposGetContentParams = {
        owner: 'baxterthehacker',
        repo: 'public-repo',
        path: '/.github/issue-close-app.yml'
      }
      expect(github.issues.createComment).toHaveBeenCalledWith(createCommentParams)
      expect(github.issues.edit).toHaveBeenCalledWith(editIssueParams)
      expect(github.repos.getContent).toHaveBeenCalledWith(getContentParams)
    })
  })
})
