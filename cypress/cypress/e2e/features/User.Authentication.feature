Feature: User authentication
  As an user 
  I want to sign in to Authentik and to the application
  I want to be able to stay logged in
  I want to log out

  Scenario: Log in to Authentik
    Given I navigate to page '/'
    When I submit the credentials 'akadmin' 'dreammall'
    Then I am on the 'authentik welcome' page