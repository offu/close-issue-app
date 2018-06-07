import { parseConfig, judge } from '../src/parser'
import * as path from 'path'

describe('parseConfig', () => {
  it('right example', () => {
    const exampleConfig = parseConfig(path.resolve(__dirname, '../example.config.yml'))
    expect(exampleConfig).toMatchSnapshot()
  })
  it('no issueConfigs', () => {
    expect(() => {
      parseConfig(path.resolve(__dirname, './wrong.config.yml'))
    }).toThrowError('invalid config')
  })
})

describe('judge', () => {
  const exampleConfig = parseConfig(path.resolve(__dirname, '../example.config.yml'))
  it('right content', () => {
    const rightContent1 = '🐱'
    expect(judge(exampleConfig, rightContent1)).toBeTruthy()

    const rightContent2 = '内容1内容2🐶'
    expect(judge(exampleConfig, rightContent2)).toBeTruthy()
  })
  it('wrong content', () => {
    const wrongContent = '123'
    expect(judge(exampleConfig, wrongContent)).toBeFalsy()
  })
})
