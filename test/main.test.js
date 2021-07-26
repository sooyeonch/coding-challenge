
const { fillEmpty, getCurrentLanguage, calculatePageRange } = require("../main.js");

// Before running this, please remember to uncomment "module.exports = { fillEmpty, calculatePageRange, getCurrentLanguage }" 
// in main.js
// Unit tests for simple functions that have return statements
// Not familiar with jest, so this is what I could come up with

test("fillEmpty(): English = selected language", () => {
    expect(fillEmpty("Hello", "", false)).toBe("Hello")
})

test("fillEmpty(): Need to use the alternative", () => {
    expect(fillEmpty("", "Bonjour", false)).toBe("Bonjour")
})

test("fillEmpty(): Both empty & showNA = false", () => {
    expect(fillEmpty("", "", false)).toBe("")
})

test("fillEmpty(): Both empty & showNA = true", () => {
    expect(fillEmpty("", "", true)).toBe("N/A")
})

test("calculatePageRange(): ", () => {
    document.body.innerHTML = '<label id="numTotalPages">10</label>';
    expect(typeof calculatePageRange(10)).toBe('object');
})

test("getCurrentLanguage(): English", () => {
    document.body.innerHTML = '<input type = "radio" id = "english" name = "language" value = "English" checked/>';
    document.getElementById('english').checked;

    expect(getCurrentLanguage()).toBe("english");
})



