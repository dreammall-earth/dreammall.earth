Feature: Login
  As a user 
  I want to sign in

  Background:
    Given The browser navigates to the login page

  Scenario: Successful Login
    When I submit the credentials 'akadmin' 'dreammall'
    # Then I am on the worldcafe page
