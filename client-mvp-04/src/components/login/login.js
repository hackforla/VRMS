import React from 'react';
import './login.scss';
import Button from '../common/button/button';
import RedirectLink from '../common/link/link';
import Title from '../common/title/title';
import Input from '../common/input/input';
import { connect } from 'react-redux';
import {
  disableElement,
  activateElement,
} from '../../store/actions/elementActions';

const Login = (props) => {
  const { disabledBtn } = props;

  function handleInputChange(e) {
    const email = e.currentTarget.value.toString();
    if (email) {
      props.dispatch(activateElement());
    } else {
      props.dispatch(disableElement());
    }
  }

  return (
    <section data-testid="login" className="login-container">
      <Title />

      <Input
        placeholder={'Enter your email'}
        type={'email'}
        onChange={(e) => handleInputChange(e)}
      />

      <RedirectLink
        path={'/page'}
        content={
          <Button
            content={`Sign in`}
            className={'login-button'}
            disabled={disabledBtn}
          />
        }
        linkKey={'login-link'}
      />
    </section>
  );
};

const mapStateToProps = function (state) {
  return {
    loggedIn: state.auth.loggedIn,
    disabledBtn: state.element.disabled,
  };
};

export default connect(mapStateToProps)(Login);
