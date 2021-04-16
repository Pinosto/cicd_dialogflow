describe('Boilerplate', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5000')
    cy.contains('boilerplate')
  })
  it('github page can be opened', function() {
    cy.visit('http://localhost:5000')
    cy.contains('React').click()
    cy.contains('cicd_dialogflow')
  })
  it('can click logo', function() {
    cy.visit('http://localhost:5000')
    cy.get('[alt="logo"]').click()
  })
})