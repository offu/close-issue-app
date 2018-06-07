import { parseConfig, shouldClose } from '../src/parser'
import * as path from 'path'
import * as fs from 'fs'

describe('parseConfig', () => {
  it('right example', () => {
    const exampleConfig = parseConfig(fs.readFileSync(path.resolve(__dirname, '../example.config.yml'), 'utf-8'))
    expect(exampleConfig).toMatchSnapshot()
  })
  it('no issueConfigs', () => {
    expect(() => {
      parseConfig(fs.readFileSync(path.resolve(__dirname, './wrong.config.yml'), 'utf-8'))
    }).toThrowError('invalid config')
  })
})

describe('shouldClose', () => {
  const exampleConfig = parseConfig(fs.readFileSync(path.resolve(__dirname, '../example.config.yml'), 'utf-8'))
  it('right content', () => {
    const rightContent1 = '🐱'
    expect(shouldClose(exampleConfig, rightContent1)).toBeFalsy()

    const rightContent2 = '内容1内容2🐶'
    expect(shouldClose(exampleConfig, rightContent2)).toBeFalsy()
  })
  it('wrong content', () => {
    const wrongContent = '123'
    expect(shouldClose(exampleConfig, wrongContent)).toBeTruthy()
  })
})
