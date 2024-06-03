Feature: Login
  As a user 
  I want to sign in

  Background:
    Given The web browser is at the login page

  Scenario: Successful Login
    When I submit the credentials 'tomsmith' 'SuperSecretPassword!'
    Then I am on the welcome page
