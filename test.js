const owaspPasswordStrengthTest = require('./path/to/owasp-password-strength-test.js');

// Configuring the library
owaspPasswordStrengthTest.config({
    minLength: 12,
    allowPassphrases: false,
    minOptionalTestsToPass: 3,
});

// Adding a custom test
owaspPasswordStrengthTest.addTest('custom', function(password) {
    if (password.includes('1234')) {
        return 'The password should not contain sequential numbers like "1234".';
    }
});

// Testing a password
const password = 'weakpassword1234!';
const result = owaspPasswordStrengthTest.test(password);

if (result.strong) {
    console.log('The password is strong!');
} else {
    console.log('The password is weak:', result.errors);
}

// Output example
// The password is weak: [
//   'The password must be at least 12 characters long.',
//   'The password should not contain sequential numbers like "1234".'
// ]
