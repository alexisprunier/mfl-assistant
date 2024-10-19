export const dateToTimezonedString = (date) => {
  const d = new Date(date + "Z");
  let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let options = { timeZone: userTimeZone, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return d.toLocaleString('en-GB', options);
}

export const dateToDayString = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate() + 1).toString().padStart(2, '0')}`;
}

export const dateToMonthString = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

export const dateToDateTimeString = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ` +
    `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

export const dateToTimeString = (date) => {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

export const unixTimestampToDayString = (unixTimestamp) => {
  const date = new Date(unixTimestamp);
  return dateToDayString(date);
}

export const unixTimestampToMonthString = (unixTimestamp) => {
  const date = new Date(unixTimestamp);
  return dateToMonthString(date);
}

export const unixTimestampToTimeString = (unixTimestamp) => {
  const date = new Date(unixTimestamp);
  return dateToTimeString(date);
}

export const substractDate = (date, unit) => {
  let resultDate = new Date(date);

  switch (unit) {
    case 'd':
      resultDate.setDate(resultDate.getDate() - 1);
      break;
    case 'w':
      resultDate.setDate(resultDate.getDate() - 7);
      break;
    case 'm':
      resultDate.setMonth(resultDate.getMonth() - 1);
      break;
    case 'q':
      resultDate.setMonth(resultDate.getMonth() - 3);
      break;
    case 'y':
      resultDate.setFullYear(resultDate.getFullYear() - 1);
      break;
    default:
      return null;
  }

  return resultDate;
}

export const addDate = (date, unit) => {
  let resultDate = new Date(date);

  switch (unit) {
    case 'd':
      resultDate.setDate(resultDate.getDate() + 1);
      break;
    case 'w':
      resultDate.setDate(resultDate.getDate() + 7);
      break;
    case 'm':
      resultDate.setMonth(resultDate.getMonth() + 1);
      break;
    case 'q':
      resultDate.setMonth(resultDate.getMonth() + 3);
      break;
    case 'y':
      resultDate.setFullYear(resultDate.getFullYear() + 1);
      break;
    default:
      return null;
  }

  return resultDate;
}