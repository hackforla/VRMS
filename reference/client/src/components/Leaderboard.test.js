import React from "react";
import LeaderBoard from "./Leaderboard";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const tree = renderer.create(<LeaderBoard />).toJSON();
  expect(tree).toMatchSnapshot();
});
