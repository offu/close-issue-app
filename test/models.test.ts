import { isConfig, isIssueConfig, isMatchConfig } from '../src/models'
import { parseConfig } from '../src/parser'
import * as path from 'path'

describe('models', () => {
  const exampleConfig = parseConfig(path.resolve(__dirname, '../config.example.yml'))

  it('isConfig', () => {
    expect(isConfig(exampleConfig)).toBeTruthy()

    const emptyExample = {}
    expect(isConfig(emptyExample)).toBeFalsy()

    const wrongExample1 = { issues: [], comment: 'test' }
    expect(isConfig(wrongExample1)).toBeFalsy()

    const wrongExample2 = { comment: 'test' }
    expect(isConfig(wrongExample2)).toBeFalsy()

    const rightExample = {
      issues: [{ label: 'test', items: [{ description: '233', content: ['123'] }] }],
      comment: 'test'
    }
    expect(isConfig(rightExample)).toBeTruthy()
  })

  it('isIssueConfig', () => {
    expect(isIssueConfig(exampleConfig.issues[0])).toBeTruthy()

    const emptyExample = {}
    expect(isIssueConfig(exampleConfig)).toBeFalsy()

    const noItemsExample = { label: 'test' }
    expect(isIssueConfig(noItemsExample)).toBeFalsy()

    const noLabelExample = { items: [{ description: 'test', content: ['233'] }] }
    expect(isIssueConfig(noLabelExample)).toBeFalsy()

    const emptyItemsExample = { ...noItemsExample, items: [] }
    expect(isIssueConfig(emptyItemsExample)).toBeFalsy()

    const wrongItemsExample = { ...noItemsExample, items: [{ description: 'test' }] }
    expect(isIssueConfig(wrongItemsExample)).toBeFalsy()

    const wrongLabelExample = { ...noLabelExample, label: 233 }
    expect(isIssueConfig(wrongLabelExample)).toBeFalsy()

    const rightExample = { ...noItemsExample, ...noLabelExample }
    expect(isIssueConfig(rightExample)).toBeTruthy()
  })

  it('isMatchConfig', () => {
    expect(isMatchConfig(exampleConfig.issues[0].items[0])).toBeTruthy()

    const emptyExample = {}
    expect(isMatchConfig(emptyExample)).toBeFalsy()

    const noContentExample = { description: 'test' }
    expect(isMatchConfig(noContentExample)).toBeFalsy()

    const noDescriptionExample = { content: ['233'] }
    expect(isMatchConfig(noDescriptionExample)).toBeFalsy()

    const emptyContentExample = { ...noContentExample, content: [] }
    expect(isMatchConfig(emptyContentExample)).toBeFalsy()

    const wrongDescriptionExample = { ...noDescriptionExample, description: 233 }
    expect(isMatchConfig(wrongDescriptionExample)).toBeFalsy()

    const wrongContentExample = { ...noContentExample, content: ['233', 233] }
    expect(isMatchConfig(wrongContentExample)).toBeFalsy()

    const rightExample = { ...noContentExample, ...noDescriptionExample }
    expect(isMatchConfig(rightExample)).toBeTruthy()
  })
})
