Feature: Tables
  As a user
  I want to enter the room reachable via the central worldcafe button,
  so that I can interact with other users in video conferences

  Scenario: Worldcafe Enter Room
    Given I navigate to page '/signin'
    When I submit the credentials 'akadmin' 'dreammall'
    Then I am on page 'worldcafe'
    When I click the enter my room button
    Then I am navigated to page where my room is queried 
