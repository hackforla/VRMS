import React from "react";
import LeaderBoard from "./Leaderboard";
import renderer from "react-test-renderer";
import { test, expect } from 'vitest'

test("renders without crashing", () => {
  const tree = renderer.create(<LeaderBoard />).toJSON();
  expect(tree).toMatchSnapshot();
});
