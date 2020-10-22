/* eslint-disable */
// https://stackoverflow.com/a/2138471

/**
 * Sets a cookie
 * @param {string} - cookie name
 * @param {string} - cookie value
 * @param {number} - cookie expiration day
 */
export function setCookie(name, value, days) {
  var expires = ""
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = "; expires=" + date.toUTCString()
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

/**
 * Checks for saved cookie, returns token
 * @param {string} - cookie name
 * @returns {(string|null)} - cookie token
 */
export function getCookie(name) {
  var nameEQ = name + "="
  var ca = document.cookie.split(";")
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

/**
 * Deletes a cookie
 * @param {string} - cookie name
 */
export function eraseCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999;"
}
