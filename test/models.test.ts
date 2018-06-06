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
    const wrongExample1 = { issueConfigArray: [], comment: 'test' }
    expect(isBotConfig(wrongExample1)).toBeTruthy()
  })

  it('no issues example', () => {
    const wrongExample2 = { comment: 'test' }
    expect(isBotConfig(wrongExample2)).toBeFalsy()
  })

  it('right example', () => {
    const rightExample = {
      issueConfigArray: [{ items: ['123'] }],
      comment: 'test'
    }
    expect(isBotConfig(rightExample)).toBeTruthy()
  })
})

describe('isIssueConfig', () => {
  it('example issue config', () => {
    expect(isIssueConfig(exampleConfig.issueConfigArray[0])).toBeTruthy()
  })

  it('no items example', () => {
    const emptyExample = {}
    expect(isIssueConfig(exampleConfig)).toBeFalsy()
  })

  it('empty items example', () => {
    const emptyItemsExample = { items: [] }
    expect(isIssueConfig(emptyItemsExample)).toBeTruthy()
  })

  it('wrong items example', () => {
    const wrongItemsExample = { items: [123] }
    expect(isIssueConfig(wrongItemsExample)).toBeFalsy()
  })
})
