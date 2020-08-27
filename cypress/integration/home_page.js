describe("Homepage", () => {
  it("User has login button", () => {
    cy.visit("/");
    cy.contains("LOGIN");
  });
});
