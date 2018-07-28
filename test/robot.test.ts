import { Application } from 'probot'
import * as path from 'path'
import * as fs from 'fs'
import app = require('../src/robot')
import payload from './fixtures/issues.event.json'
import * as yaml from 'js-yaml'

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

  describe('robot config', () => {
    it('without default config', async () => {
      const noDefaultConfig = yaml.safeLoad(exampleConfig)
      noDefaultConfig.caseSensitive = false
      noDefaultConfig.issueConfigs = [{ 'content': ['TEST'] }]
      github = {
        issues: {
          createComment: jest.fn().mockResolvedValue(null),
          edit: jest.fn().mockResolvedValue(null)
        },
        repos: {
          getContent: jest.fn().mockResolvedValue({ data: {
            content: yaml.safeDump(noDefaultConfig),
            encoding: 'utf-8'
          }})
        }
      }
      robot.auth = () => Promise.resolve(github)
      const lowerPayload = Object.assign({}, payload)
      lowerPayload.payload.issue.body = 'test'
      await robot.receive(payload)
      expect(github.issues.createComment).toMatchSnapshot()
      expect(github.issues.edit).toMatchSnapshot()
      expect(github.repos.getContent).toMatchSnapshot()
    })
  })

  describe('robot deal with issues', () => {
    it('invalid issue', async () => {
      await robot.receive(payload)
      expect(github.issues.createComment).toMatchSnapshot()
      expect(github.issues.edit).toMatchSnapshot()
      expect(github.repos.getContent).toMatchSnapshot()
    })

    it('get error', async () => {
      // Setup a new github to return an invalid config
      github.repos.getContent = jest.fn().mockResolvedValue({ data: {
        content: '233',
        encoding: 'utf-8'
      }})
      robot.auth = () => Promise.resolve(github)

      await expect(robot.receive(payload)).rejects.toThrowError('invalid config')
      const createCommentParams = github.issues.createComment.mock.calls[0][0]
      const body = createCommentParams.body
      delete createCommentParams.body
      expect(createCommentParams).toMatchSnapshot()
      expect(body).toMatch(/The app gets an error\. \:\(.*/)
    })
  })
})
