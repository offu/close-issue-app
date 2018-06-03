import { isConfig, isIssueConfig } from '../src/models'
import * as path from 'path'
import exampleConfig from './example.config.json'

describe('models', () => {

  it('isConfig', () => {
    expect(isConfig(exampleConfig)).toBeTruthy()

    const emptyExample = {}
    expect(isConfig(emptyExample)).toBeFalsy()

    const wrongExample1 = { issues: [], comment: 'test' }
    expect(isConfig(wrongExample1)).toBeFalsy()

    const wrongExample2 = { comment: 'test' }
    expect(isConfig(wrongExample2)).toBeFalsy()

    const rightExample = {
      issues: [{ items: ['123'] }],
      comment: 'test'
    }
    expect(isConfig(rightExample)).toBeTruthy()
  })

  it('isIssueConfig', () => {
    expect(isIssueConfig(exampleConfig.issues[0])).toBeTruthy()

    const emptyExample = {}
    expect(isIssueConfig(exampleConfig)).toBeFalsy()

    const emptyItemsExample = { items: [] }
    expect(isIssueConfig(emptyItemsExample)).toBeFalsy()

    const wrongItemsExample = { items: [123] }
    expect(isIssueConfig(wrongItemsExample)).toBeFalsy()
  })
})
