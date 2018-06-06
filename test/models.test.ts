import { isBotConfig, isIssueConfig } from '../src/models'
import * as path from 'path'
import exampleConfig from './example.config.json'

describe('isBotConfig', () => {
  it('example config', () => {
    expect(isBotConfig(exampleConfig)).toBeTruthy()
  })

  it('empty example', () => {
    const emptyExample = {}
    expect(isBotConfig(emptyExample)).toBeFalsy()
  })

  it('empty issues example', () => {
    const wrongExample1 = { issueConfigs: [], comment: 'test' }
    expect(isBotConfig(wrongExample1)).toBeTruthy()
  })

  it('no issues example', () => {
    const wrongExample2 = { comment: 'test' }
    expect(isBotConfig(wrongExample2)).toBeFalsy()
  })

  it('right example', () => {
    const rightExample = {
      issueConfigs: [{ content: ['123'] }],
      comment: 'test'
    }
    expect(isBotConfig(rightExample)).toBeTruthy()
  })
})

describe('isIssueConfig', () => {
  it('example issue config', () => {
    expect(isIssueConfig(exampleConfig.issueConfigs[0])).toBeTruthy()
  })

  it('no content example', () => {
    const emptyExample = {}
    expect(isIssueConfig(exampleConfig)).toBeFalsy()
  })

  it('empty content example', () => {
    const emptyItemsExample = { content: [] }
    expect(isIssueConfig(emptyItemsExample)).toBeTruthy()
  })

  it('wrong content example', () => {
    const wrongItemsExample = { content: [123] }
    expect(isIssueConfig(wrongItemsExample)).toBeFalsy()
  })
})
