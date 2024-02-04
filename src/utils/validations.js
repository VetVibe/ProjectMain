// Export a function named `isEmailValid` that takes a single parameter `_email`.
export function isEmailValid(_email) {
  // Check if the email string, after trimming whitespace, has a length greater than 0.
  if (_email.trim().length > 0) {
    // Trim whitespace from the email and assign it to a new variable `email`.
    const email = _email.trim();
    // Define a regular expression `regexEmail` to validate the email format.
    const regexEmail =
      /^(?:[\w!#$%&'*+\-/=?^`{|}~]+\.)*[\w!#$%&'*+\-/=?^`{|}~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
    // Check if the `email` matches the defined regular expression.
    if (!email.match(regexEmail)) {
      // If the email does not match the regex, return `false` indicating invalid email.
      return false;
    }
    // If the email matches the regex, return `true` indicating valid email.
    return true;
  }
  // If the trimmed email string is empty, return `false` indicating invalid email.
  return false;
}

// Export a function named `isPasswordValid` that validates a given password against defined criteria.
/**
 * The comment block explains the criteria for a valid password:
 * 1. At least 8 characters
 * 2. At least one uppercase letter
 * 3. At least one lowercase letter
 * 4. At least one digit
 * 5. At least one special character
 */

export function isPasswordValid(password) {
  // Define a regular expression `passwordregix` to match the password validation criteria.
  const passwordregix = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,50}$/;
  // Use the `match` method to check if the password matches the regular expression.
  // The `Array.isArray` method is used to check if the result of the `match` method is an array.
  // The `match` method returns an array if there is a match, null otherwise.
  // Therefore, this line effectively checks if the password matches the regular expression.
  return Array.isArray(password.match(passwordregix));
}