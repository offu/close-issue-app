# Close Issue Bot
[![Build Status](https://travis-ci.org/offu/close-issue-bot.svg?branch=master)](https://travis-ci.org/offu/close-issue-bot)
[![codecov](https://codecov.io/gh/offu/close-issue-bot/branch/master/graph/badge.svg)](https://codecov.io/gh/offu/close-issue-bot)  
A bot to close issues.
## Getting Started
### Installing
If you use **yarn**:
``` bash
yarn install
```
or **npm**:
``` bash
npm install
```
### Build
The whole project is written in TypeScript. So you must compile it.
``` bash
# yarn
yarn build
# npm
npm run build
```
### Configuration
Any repo that installs this app needs to put a configuration in ```/.github/issue-close-bot.yml```. There's an example in ```example.config.yml```:
``` yaml
# Comment that will be sent if an issue is judged to be closed
comment: test
# You can have several configs for different issue.
issueConfigs:
- content:
  - content1
  - content2
  - "🐶"
- content:
  - "🐱"
```
Any issue that doesn't include all contents in the same issueConfig will be closed.
### Run
Before running this bot, please read [probot docs](https://probot.github.io/docs/development/) first.
After finshing all things mentioned in the doc:
```bash
yarn start
# Or
npm run start
```
### Deployment
Read [probot docs](https://probot.github.io/docs/deployment/).

