import { Application, Context } from 'probot'
import * as path from 'path'
import * as fs from 'fs'
import app = require('../src/robot')
import payload from './fixtures/issues.event.json'
import * as yaml from 'js-yaml'
import { RequestError as HttpError } from '@octokit/request-error'
import { BotConfig } from '../src/models'

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
        update: jest.fn().mockResolvedValue(null)
      },
      repos: {
        getContents: jest.fn().mockResolvedValue({ data: {
          content: exampleConfig,
          encoding: 'utf-8'
        }})
      }
    }
    robot.auth = () => Promise.resolve(github)
  })

  describe('robot config', () => {
    it('without default config', async () => {
      const noDefaultConfig = <BotConfig>yaml.safeLoad(exampleConfig)
      noDefaultConfig.caseInsensitive = true
      noDefaultConfig.issueConfigs = [{ 'content': ['TEST'] }]
      github = {
        issues: {
          createComment: jest.fn().mockResolvedValue(null),
          update: jest.fn().mockResolvedValue(null)
        },
        repos: {
          getContents: jest.fn().mockResolvedValue({ data: {
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
      expect(github.issues.update).toMatchSnapshot()
      expect(github.repos.getContents).toMatchSnapshot()
    })
  })

  describe('robot deal with issues', () => {
    it('invalid issue', async () => {
      await robot.receive(payload)
      expect(github.issues.createComment).toMatchSnapshot()
      expect(github.issues.update).toMatchSnapshot()
      expect(github.repos.getContents).toMatchSnapshot()
    })

    it('get invalid config', async () => {
      // Setup a new github to return an invalid config
      github.repos.getContents = jest.fn().mockResolvedValue({ data: {
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

    it('config file not found', async () => {
      const error = new HttpError('test', 404, {
        headers: {},
        request: {
          method: 'GET',
          url: 'test',
          headers: {}
        }
      })
      github.repos.getContents = jest.fn().mockImplementation(async (context: Context, path: string) => {
        throw error
      })
      robot.auth = () => Promise.resolve(github)
      const mockedError = jest.spyOn(console, 'error')
      mockedError.mockImplementation()

      await robot.receive(payload)
      expect(console.error).toBeCalledWith(error)
      mockedError.mockReset()
    })

    it('create label if the label does not exist', async () => {
      github.issues.createLabel = jest.fn().mockResolvedValue(null)
      github.issues.addLabels = jest.fn().mockResolvedValue(null)
      const error = new HttpError('test', 404, {
        headers: {},
        request: {
          method: 'GET',
          url: 'test',
          headers: {}
        }
      })
      github.issues.getLabel = jest.fn().mockImplementation(async (context: Context, path: string) => {
        throw error
      })
      const config = <BotConfig>yaml.safeLoad(exampleConfig)
      config.label = '🐱'
      github.repos.getContents = jest.fn().mockResolvedValue({ data: {
        content: yaml.safeDump(config),
        encoding: 'utf-8'
      }})
      await robot.receive(payload)
      expect(github.issues.createLabel).toMatchSnapshot()
      expect(github.issues.addLabels).toMatchSnapshot()
    })
  })
})
