export function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let ageYears = today.getFullYear() - dob.getFullYear();
  let ageMonths = today.getMonth() - dob.getMonth();

  if (ageMonths < 0 || (ageMonths === 0 && today.getDate() < dob.getDate())) {
    ageYears--;
    ageMonths += 12;
  }

  let ageString;
  if (ageYears === 0) {
    ageString = `${ageMonths} month${ageMonths !== 1 ? "s" : ""}`;
  } else {
    ageString = `${ageYears} year${ageYears !== 1 ? "s" : ""}`;
    if (ageMonths > 0) {
      ageString += ` and ${ageMonths} month${ageMonths !== 1 ? "s" : ""}`;
    }
  }

  return ageString;
}

export const formattedDate = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export function formatDateForRating(date) {
  const currentDate = new Date();
  const providedDate = new Date(date);

  const yearDiff = currentDate.getFullYear() - providedDate.getFullYear();

  if (yearDiff > 1) {
    return `${yearDiff}y ago`;
  } else if (yearDiff === 1) {
    return `1y ago`;
  } else {
    return providedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}
