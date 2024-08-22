(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory();
    } else {
      root.owaspPasswordStrengthTest = factory();
    }
  }(this, function () {
    
    const owasp = {};
    
    // Configuration settings for password strength testing
    owasp.configs = {
      allowPassphrases       : true,
      maxLength              : 128,
      minLength              : 10,
      minPhraseLength        : 20,
      minOptionalTestsToPass : 4,
      customTests            : [],  // Custom tests added by the user
    };
  
    // Helper method to update configuration parameters
    owasp.config = function(params) {
      for (let prop in params) {
        if (params.hasOwnProperty(prop) && this.configs.hasOwnProperty(prop)) {
          this.configs[prop] = params[prop];
        }
      }
    };
  
    // Core password strength tests
    owasp.tests = {
  
      required: [
  
        // Enforce a minimum length
        function(password) {
          if (password.length < owasp.configs.minLength) {
            return `The password must be at least ${owasp.configs.minLength} characters long.`;
          }
        },
  
        // Enforce a maximum length
        function(password) {
          if (password.length > owasp.configs.maxLength) {
            return `The password must be fewer than ${owasp.configs.maxLength} characters.`;
          }
        },
  
        // Forbid repeating characters
        function(password) {
          if (/(.)\1{2,}/.test(password)) {
            return 'The password may not contain sequences of three or more repeated characters.';
          }
        },
  
      ],
  
      optional: [
  
        // Require at least one lowercase letter
        function(password) {
          if (!/[a-z]/.test(password)) {
            return 'The password must contain at least one lowercase letter.';
          }
        },
  
        // Require at least one uppercase letter
        function(password) {
          if (!/[A-Z]/.test(password)) {
            return 'The password must contain at least one uppercase letter.';
          }
        },
  
        // Require at least one number
        function(password) {
          if (!/[0-9]/.test(password)) {
            return 'The password must contain at least one number.';
          }
        },
  
        // Require at least one special character
        function(password) {
          if (!/[^A-Za-z0-9]/.test(password)) {
            return 'The password must contain at least one special character.';
          }
        },
  
      ],
  
      // Custom tests added by the user
      custom: []
    };
  
    // Method to add custom tests
    owasp.addTest = function(type, testFn) {
      if (type === 'required') {
        this.tests.required.push(testFn);
      } else if (type === 'optional') {
        this.tests.optional.push(testFn);
      } else {
        this.tests.custom.push(testFn);
      }
    };
  
    // Method to test password strength
    owasp.test = function(password) {
  
      const result = {
        errors              : [],
        failedTests         : [],
        passedTests         : [],
        requiredTestErrors  : [],
        optionalTestErrors  : [],
        customTestErrors    : [],
        isPassphrase        : false,
        strong              : true,
        optionalTestsPassed : 0,
      };
  
      // Run required tests
      runTests(owasp.tests.required, password, result, 'requiredTestErrors');
      
      // Run optional tests
      if (!result.isPassphrase) {
        runTests(owasp.tests.optional, password, result, 'optionalTestErrors');
      }
  
      // Run custom tests
      runTests(owasp.tests.custom, password, result, 'customTestErrors');
  
      // Check if enough optional tests were passed
      if (!result.isPassphrase && result.optionalTestsPassed < owasp.configs.minOptionalTestsToPass) {
        result.strong = false;
      }
  
      return result;
    };
  
    // Helper function to run tests
    function runTests(tests, password, result, errorType) {
      tests.forEach(function(test, index) {
        const err = test(password);
        if (typeof err === 'string') {
          result.strong = false;
          result.errors.push(err);
          result[errorType].push(err);
          result.failedTests.push(index);
        } else {
          result.passedTests.push(index);
          if (errorType === 'optionalTestErrors') {
            result.optionalTestsPassed++;
          }
        }
      });
    }
  
    return owasp;
    
  
  }));
  