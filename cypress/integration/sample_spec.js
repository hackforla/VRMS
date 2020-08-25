const url = "http://localhost:3000";

describe("My First Test", () => {
  it("Visits the main page", () => {
    cy.visit(url);
  });
});
