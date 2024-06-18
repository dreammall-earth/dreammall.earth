Feature: User tables
  As a user
  I want to enter the room reachable via the central worldcafe button

  Scenario: Worldcafe Enter Room
    Given I navigate to page '/signin'
    When I submit the credentials 'akadmin' 'dreammall'
    Then I am on page 'worldcafe'
