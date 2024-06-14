Feature: User authentication
  As a user 
  I want to sign in to Authentik and to the DreamMall application
  I want to be able to stay logged in
  I want to log out

  Scenario: Authentik Login
    Given I navigate to page 'authentik'
    When I submit the credentials 'akadmin' 'dreammall'
    Then I am on page 'authentik welcome'
  
  Scenario: Authentik Refresh and Stay logged in
    Given I navigate to page 'authentik'
    When I submit the credentials 'akadmin' 'dreammall'
    Then I am on page 'authentik welcome'
    When I refresh the page
    Then I am on page 'authentik welcome'
  
  Scenario: Authentik Logout
    Given I navigate to page 'authentik'
    When I submit the credentials 'akadmin' 'dreammall'
    Then I am on page 'authentik welcome' 
    When I log out from Authentik

  Scenario: DreamMall Login
    Given I navigate to page '/signin'
    When I submit the credentials 'akadmin' 'dreammall'
    And I confirm the consent agreement
    Then I am on page 'worldcafe'

  Scenario: DreamMall Refresh and Stay logged in
    Given I navigate to page '/signin'
    When I submit the credentials 'akadmin' 'dreammall'
    And I confirm the consent agreement
    Then I am on page 'worldcafe'
    When I refresh the page
    Then I am on page 'worldcafe'

  Scenario: DreamMall Logout
    Given I navigate to page '/signin'
    When I submit the credentials 'akadmin' 'dreammall'
    And I confirm the consent agreement
    Then I am on page 'worldcafe'
    When I log out from DreamMall
    Then I am on page 'presenter' 
