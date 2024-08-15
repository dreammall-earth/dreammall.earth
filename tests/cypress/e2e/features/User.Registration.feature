Feature: User registration
  As a user
  I want to sign up to the DreamMall application
  So that I can sign in to the DreamMall application

  Scenario: DreamMall Signup
    Given I navigate to page 'signup'
    When I submit the signup form with:
      | username | Bibi              |
      | name     | Bloxberg          |
      | email    | bibi@bloxberg.org |
      | password | Aa12345_          |
    Then an email transmission confirmation is displayed
    And I receive an email containing the account confirmation link
    # When I open the account confirmation link in the browser
    # Then I am on page 'signin'
    # When I submit the credentials 'akadmin' 'dreammall'
    # Then I am on page 'worldcafe'