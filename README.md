# Close Issue App
[![Build Status](https://github.com/offu/close-issue-app/workflows/Run%20tests/badge.svg)](https://github.com/offu/close-issue-app/actions)
[![codecov](https://codecov.io/gh/offu/close-issue-app/branch/master/graph/badge.svg)](https://codecov.io/gh/offu/close-issue-app)  
An app to close issues.
### What It Does
The app will check new opened and reopened issues if they include some specific contents. Issues not passed will be commented then closed.
### Usage
1. Create a `.github/issue-close-app.yml` file in your repo. Here's an example:  
``` yaml
# Comment that will be sent if an issue is judged to be closed.
comment: "This issue is closed because it does not meet our issue template. Please read it."
issueConfigs:
# There can be several configs for different kind of issues.
- content:
# Example 1: bug report
  - "Expected Behavior"
  - "Current Behavior"
  - "Steps to Reproduce"
  - "Detailed Description"
- content:
# Example 2: feature request
  - "Motivation / Use Case"
  - "Expected Behavior"
  - "Other Information"
# Optional configuration:
#
# whether the keywords are case-insensitive
# default value is false, which means keywords are case-sensitive
caseInsensitive: false
# the label that will be added when the bot close an issue
# The bot will only add a label if this property is set.
label: "closed by bot"
# The bot will ignore any issues that are opened or reopened by the user names in exception
exception:
  - "username1"
  - "username2"
# The issue is judged to be legal if it includes all keywords from any of these two configs.
# Or it will be closed by the app.
```
The config file is **required** to run this app. If the app can not find a valid config file, it will ignore requests from the repo.  
2. Install the [close-issue-app](https://github.com/apps/close-issue-app).  
3. Enjoy!

### Deployment
Read [probot docs](https://probot.github.io/docs/deployment/).

