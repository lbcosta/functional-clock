const compose = (...fns) => arg =>
  fns.reduce((composed, f) => f(composed), arg);

const oneSecond = () => 1000;
const getCurrentTime = () => new Date();

const log = time => {
  Object.keys(time).forEach(
    key => (document.querySelector(`#${key}`).textContent = time[key])
  );
};

const serializeClockTime = date => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds()
});

const civilianHours = clockTime => ({
  ...clockTime,
  hours: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours
});

const appendAMPM = clockTime => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? "PM" : "AM"
});

const display = target => time => target(time);

const formatClock = format => time =>
  format
    .replace("hh", time.hours)
    .replace("mm", time.minutes)
    .replace("ss", time.seconds)
    .replace("tt", time.ampm);

const prependZero = key => clockTime => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? "0" + clockTime[key] : clockTime[key]
});

const convertToCivilianTime = clockTime =>
  compose(appendAMPM, civilianHours)(clockTime);

const doubleDigits = civilianTime =>
  compose(
    prependZero("hours"),
    prependZero("minutes"),
    prependZero("seconds")
  )(civilianTime);

const startTicking = () =>
  setInterval(
    compose(
      getCurrentTime,
      serializeClockTime,
      convertToCivilianTime,
      doubleDigits,
      display(log)
    ),
    oneSecond()
  );

startTicking();

fetch("https://api.kanye.rest/")
  .then(res => res.json())
  .then(
    payload =>
      (document.querySelector(
        "#quote"
      ).textContent = `"${payload.quote}" - Kanye West`)
  );
