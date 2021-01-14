const parseDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const m = d.getMonth() + 1;
  const month = m < 10 ? `0${m}` : m;
  const days = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
  const seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();
  return `${year}-${month}-${days} ${hours}h:${minutes}m:${seconds}s`;
};
 const addDays = (days, date_string) => {
  const date = new Date(date_string)
  date.setDate(date.getDate() + days);
  return date;
};
module.exports={
  parseDate,
  addDays
}