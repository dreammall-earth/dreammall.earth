Feature: User authentication
  As a user 
  I want to sign in to Authentik and to the DreamMall application
  I want to be able to stay logged in
  I want to log out

  Scenario: Authentik Login
    Given I navigate to page 'authentik'
    When I submit the credentials 'akadmin' 'dreammall'
    Then I am on the 'authentik welcome' page

  Scenario: DreamMall Login
    Given I navigate to page '/signin'
    When I submit the credentials 'akadmin' 'dreammall'
    And I confirm the consent agreement
    Then I am on the worldcafe page

  Scenario: DreamMall and stay logged in
    Given I navigate to page '/signin'
    When I submit the credentials 'akadmin' 'dreammall'
    And I confirm the consent agreement
    Then I am on the worldcafe page
    When I refresh the page
    Then I am on the worldcafe page

  Scenario: DreamMall Logout
    Given I navigate to page '/signin'
    When I submit the credentials 'akadmin' 'dreammall'
    And I confirm the consent agreement
    Then I am on the worldcafe page
    When I log out
    Then I am on page 'presenter'
