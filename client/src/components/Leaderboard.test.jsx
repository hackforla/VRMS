import React from "react";
import LeaderBoard from "./Leaderboard";
import { render } from "@testing-library/react";
import { test, expect } from 'vitest';

test("renders without crashing", () => {
  const { container } = render(<LeaderBoard />);
  expect(container).toMatchSnapshot();
});