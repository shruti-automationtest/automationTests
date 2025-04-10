# AvatarUX

# Project Description

This project uses Playwright for automated testing, and Sharp for image manipulation. The tests include scenarios that interact with web pages and perform visual comparisons.

#How to Run Tests

Clone the Repository:
git clone https://github.com/shrutiautomationtest/automationTests.git

cd your-project-directory

install dependencies-
npm install
npm sharp
npx playwright test           (run all suites)
npx playwright test tests/gameTest.spec.js

Pages (POM Implementation):
The Page Object Model (POM) design pattern is used to manage page interactions and elements.

Selectors (Object Repo):
All UI selectors are organized in a separate repository for better maintainability.

Screenshots:
Screenshots are taken at each test step for visual validation and debugging.

Temp (Resized Images):
Temporary resized images are used to access and manipulate the canvas in image-related tests.

Test Files (Spec Files):
All test cases are located within the tests directory, with separate spec files for each test scenario.

Utilities:
Contains utilities for canvas handling, image comparison, and other helper functions.

Playwright Config File:
The configuration file for Playwright contains basic project settings and options for running tests.

