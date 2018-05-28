interface ProBot {
  log: any
}

export = (robot: ProBot) => {
  robot.log('Yay, the app was loaded!')
}
