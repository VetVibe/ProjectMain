  const isSameDayDates = (d1, d2) => {
    return d1.getDate() === d2.getDate()
      && d1.getFullYear() === d2.getFullYear()
      && d1.getMonth() === d2.getMonth();
  };
  
  const toDateString = (d, hour) => {
    return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()} at ${hour}`;
  };
  
  // Use export instead of module.exports
  export { isSameDayDates, toDateString };
  