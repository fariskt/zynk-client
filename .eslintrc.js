module.exports = {
    extends: ['next', 'next/core-web-vitals', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // Downgrade to a warning
      // or
      // "@typescript-eslint/no-explicit-any": "off", // Completely disable
    },
  };
  