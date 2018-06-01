import { parseConfig, judge, matchIssueConfig } from '../src/parser'
import * as path from 'path'

describe('parser', () => {
  const exampleConfig = parseConfig(path.resolve(__dirname, '../config.example.yml'))

  it('parseConfig', () => {
    expect(exampleConfig).toMatchSnapshot()
  })

  it('matchIssueConfig', () => {
    expect(
      matchIssueConfig(exampleConfig.issues, [exampleConfig.issues[0].label])
    ).toEqual(exampleConfig.issues[0])
  })

  it('judge', () => {
    const wrongContent = '内容1内容2'
    expect(judge(matchIssueConfig(exampleConfig.issues, ['bug']), wrongContent)).toBeFalsy()

    const rightContent = '内容1内容2🐶'
    expect(judge(matchIssueConfig(exampleConfig.issues, ['bug']), rightContent)).toBeTruthy()
  })
})
