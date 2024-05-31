Feature: Login
  As a user 
  I want to sign in
  I want to be able to stay logged in
  I want to logout again

  Background:
    Given The browser navigates to the login page

  Scenario: Successful Login
    When I submit the credentials 'akadmin' 'dreammall'
    Then I am on the worldcafe page
  
  Scenario: Refresh and stay logged in
    # Given I am logged in as 'akadmin' 'dreammall'
    When I submit the credentials 'akadmin' 'dreammall'
    Then I am on the worldcafe page
    #
    When I refresh the page
    Then I am on the worldcafe page

