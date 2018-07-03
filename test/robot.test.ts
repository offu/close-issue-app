import { Application } from 'probot'
import { IssuesCreateCommentParams, IssuesEditParams, ReposGetContentParams } from '@octokit/rest'
import * as path from 'path'
import * as fs from 'fs'
import app = require('../src/robot')
import { errorComment } from '../src/models'
import payload from './fixtures/issues.event.json'

describe('robot', () => {
  let robot
  let github
  const exampleConfig = fs.readFileSync(path.resolve(__dirname, '../example.config.yml'), 'utf-8')

  beforeEach(() => {
    robot = new Application()
    robot.load(app)
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

    it('get error', async () => {
      // Setup a new github to return an invalid config
      github.repos.getContent = jest.fn().mockResolvedValue({ data: {
        content: '233',
        encoding: 'utf-8'
      }})
      robot.auth = () => Promise.resolve(github)

      await expect(robot.receive(payload)).rejects.toThrowError('invalid config')
      const errorCommentParams: IssuesCreateCommentParams = {
        owner: 'baxterthehacker',
        repo: 'public-repo',
        number: 2,
        body: `${errorComment}\n\`\`\` log\ninvalid config\n\`\`\``
      }
      expect(github.issues.createComment).toHaveBeenCalledWith(errorCommentParams)
    })
  })
})
