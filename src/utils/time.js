const timeDiff = (mysqlTime) => {
  let _time = new Date(mysqlTime).getTime()
  let second = Math.round((Date.now() - _time) / 1000)
  let time = 0;
  if (second < 60) {
    return "Just now";
  }
  if (second < 3600) {
    time = Math.round(second / 60);
    if (time == 1) {
      return "A minute ago";
    }
    return time + " minutes ago";
  }
  if (second < 86400) {
    time = Math.round(second / 3600);
    if (time == 1) {
      return "An hour ago";
    }
    return time + " hours ago";
  }
  if (second < 2629800) {
    time = Math.round(second / 86400);
    if (time == 1) {
      return "A day ago";
    }
    return time + " days ago";
  }
  if (second < 31557600) {
    time = Math.round(second / 2629800);
    if (time == 1) {
      return "A month ago";
    }
    return time + " months ago";
  }
  time = Math.round(second / 31557600);
  if (time == 1) {
    return "A year ago";
  }
  return time + " years ago";
}

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday', 'Sunday']

const MONTHS = ['Jan', 'Feb', 'Marh', 'Apr', 'May', "June",
  'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getTime = mysqlTime => {
  let time = new Date(mysqlTime)
  let minute = time.getMinutes().toString().length === 1 ? `0${time.getMinutes()}` : time.getMinutes()
  let hour = time.getHours().toString().length === 1 ? `0${time.getHours()}` : time.getHours()
  return `${WEEK_DAYS[time.getDay()]}, ${MONTHS[time.getMonth()]} ${time.getDate()} ${time.getFullYear()} ${hour}:${minute}`
}

export { timeDiff, getTime }