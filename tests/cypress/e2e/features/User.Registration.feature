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
    And I receive an account confirmation email
    When I 


    Then I am on page 'worldcafe'