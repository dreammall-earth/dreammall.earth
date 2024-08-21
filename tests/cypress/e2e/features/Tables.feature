Feature: Tables
  As a user
  I want to enter the table reachable via the central worldcafe button,
  so that I can interact with other users in video conferences

  Scenario: Worldcafe Enter Table
    Given I navigate to page '/signin'
    When I submit the credentials 'akadmin' 'dreammall'
    Then I am on page 'worldcafe'
    When I click the enter my table button
    Then My table is queried 
