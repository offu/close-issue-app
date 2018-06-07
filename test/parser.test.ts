import { parseConfig } from '../src/parser'
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
