import { parseConfig, shouldClose } from '../src/parser'
import * as path from 'path'
import * as fs from 'fs'

describe('parseConfig', () => {
  it('right example without default values', () => {
    const exampleConfig = parseConfig(fs.readFileSync(path.resolve(__dirname, '../example.config.yml'), 'utf-8'))
    expect(exampleConfig).toMatchSnapshot()
  })
  it('right example with default values', () => {
    const exampleConfig = parseConfig(fs.readFileSync(path.resolve(__dirname, './example.with.default.value.config.yml'), 'utf-8'))
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
    expect(shouldClose(exampleConfig, rightContent1, '233')).toBeFalsy()

    const rightContent2 = '内容1内容2🐶'
    expect(shouldClose(exampleConfig, rightContent2, '233')).toBeFalsy()
  })
  it('right content case-sensitive', () => {
    const exampleConfig = parseConfig(fs.readFileSync(path.resolve(__dirname, '../example.config.yml'), 'utf-8'))
    exampleConfig.issueConfigs = [{ 'content': ['TEST'] }]
    expect(shouldClose(exampleConfig, 'test', '233')).toBeTruthy()
  })
  it('right content case-insensitive', () => {
    const exampleConfig = parseConfig(fs.readFileSync(path.resolve(__dirname, '../example.config.yml'), 'utf-8'))
    exampleConfig.issueConfigs = [{ 'content': ['TEST'] }]
    exampleConfig.caseInsensitive = true
    expect(shouldClose(exampleConfig, 'test', '233')).toBeFalsy()
  })
  it('wrong content', () => {
    const wrongContent = '123'
    expect(shouldClose(exampleConfig, wrongContent, '233')).toBeTruthy()
  })
  it('with exception', () => {
    const exampleConfigWithException = parseConfig(fs.readFileSync(path.resolve(__dirname, './example.with.default.value.config.yml'), 'utf-8'))
    const wrongContent = '123'
    expect(shouldClose(exampleConfigWithException, wrongContent, 'username1')).toBeFalsy()
    expect(shouldClose(exampleConfigWithException, wrongContent, 'someone')).toBeTruthy()
  })
})
