import { isConfig, isIssueConfig } from '../src/models'
import * as path from 'path'
import exampleConfig from './example.config.json'

describe('isConfig', () => {
  it('example config', () => {
    expect(isConfig(exampleConfig)).toBeTruthy()
  })

  it('empty example', () => {
    const emptyExample = {}
    expect(isConfig(emptyExample)).toBeFalsy()
  })

  it('empty issues example', () => {
    const wrongExample1 = { issues: [], comment: 'test' }
    expect(isConfig(wrongExample1)).toBeTruthy()
  })

  it('no issues example', () => {
    const wrongExample2 = { comment: 'test' }
    expect(isConfig(wrongExample2)).toBeFalsy()
  })

  it('wright example', () => {
    const rightExample = {
      issues: [{ items: ['123'] }],
      comment: 'test'
    }
    expect(isConfig(rightExample)).toBeTruthy()
  })
})

describe('isIssueConfig', () => {
  it('example issue config', () => {
    expect(isIssueConfig(exampleConfig.issues[0])).toBeTruthy()
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
