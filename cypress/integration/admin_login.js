describe("Admin Login", () => {
  it("User cannot leave field empty", () => {
    cy.visit("/login");
    cy.get("[data-test=input-email]").click().type(" ");
    cy.get("[data-test=login-btn]").click();
    cy.contains("Please don't leave the field blank");
  });
  it("User must complete email", () => {
    cy.visit("/login");
    cy.get("[data-test=input-email]").click().type("admin@test");
    cy.get("[data-test=login-btn]").click();
    cy.contains("Please format the email address correctly");
  });
  it("Admin can login", () => {
    cy.visit("/login");
    cy.get("[data-test=input-email]").click().type("testAdminAccount@VRMS.io");
    cy.get("[data-test=login-btn]").click();
    // TODO: Add test database for full end to end testing
    // cy.contains("Success");  
  });
});
