const jobRoleService = require('./jobRole.service');
const { setupDB } = require("../setup-test");

setupDB("jobRole-service");

describe("JobRoleService can save and retrieve job roles", () => {
  test("Save job roles and then retrieve it by the service", async (done) => {

    const rolesArrayFinal = ["role1", "role2", "role3", "role4", "role5"];

    const emptyArray = [];
   
    await jobRoleService.add(emptyArray);
    const savedRolesEmpty = await jobRoleService.getAll();
    expect(savedRolesEmpty.length).toEqual(0);

    const rolesArray1 = ["role1", "role2", "role3"];
    await jobRoleService.add(rolesArray1);
    const savedRoles = await jobRoleService.getAll();

    expect(savedRoles.length).toEqual(3);
    expect(savedRoles[0]).toEqual(rolesArray1[0]);
    expect(savedRoles[1]).toEqual(rolesArray1[1]);
    expect(savedRoles[2]).toEqual(rolesArray1[2]);

    // duplicate role3 should be not be inserted again
    const rolesArray2 = ["role3", "role4", "role5"];
    await jobRoleService.add(rolesArray2);
    const savedRoles2 = await jobRoleService.getAll();

    expect(savedRoles2.length).toEqual(5);
    expect(savedRoles2[0]).toEqual(rolesArrayFinal[0]);
    expect(savedRoles2[1]).toEqual(rolesArrayFinal[1]);
    expect(savedRoles2[2]).toEqual(rolesArrayFinal[2]);
    expect(savedRoles2[3]).toEqual(rolesArrayFinal[3]);
    expect(savedRoles2[4]).toEqual(rolesArrayFinal[4]);

    // invalid array should be ignored
    const rolesArray3 = ["    ", "role6", "role7"];
    await jobRoleService.add(rolesArray3);
    const savedRoles3 = await jobRoleService.getAll();

    expect(savedRoles3.length).toEqual(5);
    expect(savedRoles3[0]).toEqual(rolesArrayFinal[0]);
    expect(savedRoles3[1]).toEqual(rolesArrayFinal[1]);
    expect(savedRoles3[2]).toEqual(rolesArrayFinal[2]);
    expect(savedRoles3[3]).toEqual(rolesArrayFinal[3]);
    expect(savedRoles3[4]).toEqual(rolesArrayFinal[4]);

    done();
  });
});
