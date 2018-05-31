import { parseConfig, isConfig, judge } from '../src/parser'
import * as path from 'path'

describe('parser', () => {
  const exampleConfig = parseConfig(path.resolve(__dirname, '../config.example.yml'))

  it('parseConfig', () => {
    expect(exampleConfig).toMatchSnapshot()
  })

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

  it('judge', () => {
    const wrongContent = '内容1内容2'
    expect(judge(exampleConfig.issues, ['bug'], wrongContent)).toBeFalsy()

    const rightContent = '内容1内容2🐶'
    expect(judge(exampleConfig.issues, ['bug'], rightContent)).toBeTruthy()
  })
})
