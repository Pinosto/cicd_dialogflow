describe('Boilerplate', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5000')
    cy.contains('boilerplate')
  })
  it('can click logo', function() {
    cy.visit('http://localhost:5000')
    cy.get('[alt="logo"]').click()
  })
  it('github link on page', function() {
    cy.visit('http://localhost:5000')
    cy.contains('React')
  })
})