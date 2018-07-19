function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomEndingOption () {
  let i = getRandomInt(0, 5)

  let options = [
    'Is it over yet?',
    'I HATE Techies...',
    'Bathroom Break!',
    'Push to Win',
    'Don\'t leave highground',
    'It is time to stop farming'
  ]
  return options[i]
}
