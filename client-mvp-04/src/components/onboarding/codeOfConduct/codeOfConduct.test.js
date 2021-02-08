import React from 'react';
import CodeOfConduct from './codeOfConduct';
import service from '../../../services/data.service';
import {
  render,
  cleanup,
  wait,
  screen,
  fireEvent,
} from '@testing-library/react';
import { CodeOfConductMarkdown } from '../../../utils/testUtils/mocks/dataMock';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

/**
 * Mock service
 */
jest.mock('../../../services/data.service', () => jest.fn());
service.getCodeOfConductContent = jest.fn(() => {
  return CodeOfConductMarkdown;
});
const history = createMemoryHistory();

beforeEach(async () => {
  render(
    <Router history={history}>
      <CodeOfConduct />
    </Router>
  );

  await wait(async () => {
    expect(() =>
      service.getCodeOfConductContent().toEqual(CodeOfConductMarkdown)
    );
  });

  console.error = jest.fn();
});

afterEach(cleanup);

describe('CodeOfConduct', () => {
  test('Should render component, fetch and display CodeOfConduct content', () => {
    expect(screen.getByTestId('code-of-conduct-container')).toBeInTheDocument();
    expect(screen.getByTestId('code-of-conduct-content')).toHaveTextContent(
      'Hack for LA expects '
    ); // starts with str
    expect(screen.getByTestId('code-of-conduct-content')).toHaveTextContent(
      'a harassment-free environment.'
    ); // ends with str
  });

  test('Should have don`t agree button and display popup onClick', () => {
    const dontAgreeBtn = screen.getByTestId('dont-agree-btn');
    expect(screen.getByTestId('code-of-conduct-buttons')).toBeInTheDocument();
    expect(dontAgreeBtn).toBeInTheDocument();
    fireEvent.click(dontAgreeBtn);
    expect(screen.getByTestId('popup-container')).toHaveClass('open');
    expect(screen.getByTestId('popup-container')).toHaveTextContent(
      'You must agree'
    );
  });

  test('Should have an agree button and redirect to the dummy page', () => {
    const agreeBtn = screen.getByTestId('agree-btn');
    expect(agreeBtn).toBeInTheDocument();
    fireEvent.click(agreeBtn);
    expect(history.location.pathname).toBe('/page');
  });

  test('Should display progress bar with two active dots', () => {
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getAllByTestId('progress-item').length).toEqual(6);
    expect(screen.getAllByTestId('progress-item')[0]).toHaveClass(
      'progress-item active'
    );
    expect(screen.getAllByTestId('progress-item')[1]).toHaveClass(
      'progress-item active'
    );
    expect(screen.getAllByTestId('progress-item')[2]).not.toHaveClass('active');
  });
});
