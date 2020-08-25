const url = "http://localhost:3000";

describe("Homepage", () => {
  it("User has login button", () => {
    cy.visit(url);
    cy.contains("LOGIN");
  });
});
