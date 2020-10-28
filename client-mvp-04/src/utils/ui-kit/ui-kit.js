import React from 'react';
import './ui-kit.scss';
import Button from '../../components/common/button/button';
import confirmIcon from '../../assets/images/icons/confirm.svg';
import homeIcon from '../../assets/images/icons/home.png';
import projectIcon from '../../assets/images/icons/311.png';
import gitHubIcon from '../../assets/images/icons/github.png';

/***** DEV-UI-KIT FOR DEVELOPMENT ONLY *****/
/*UI KIT helps devs determine, which UI elements will be used throughout
the application. UI elements created based on finalized v0.4 Style Guide.*/

const DevUiKit = () => {
  return (
    <div className={'kit-container'}>
      <div className={'kit-title'}>VRMS DEV UI-KIT</div>

      {/*** HEADERS ***/}
      <div className={'header-container'}>
        <h1 className={'kit-sec-title'}>*** HEADERS ***</h1>
        <h1>VRMS h1</h1>
        <p className={'dev-comment'}>h1 Header: 30px, bold; Main Page Header</p>
        <h2>VRMS h2</h2>
        <p className={'dev-comment'}>
          h2 Header: 24px, semi-bold; Home Section Header
        </p>
        <h2 className={'bold'}>VRMS h2</h2>
        <p className={'dev-comment'}>
          h2 Header: 24px, bold; Project Section Header / Onboarding Screens
        </p>
        <h3>VRMS h3</h3>
        <p className={'dev-comment'}>
          h3 Header: 18px, bold; Profile section header
        </p>
        <h3 className={'regular'}>VRMS h3</h3>
        <p className={'dev-comment'}>h3 Header: 18px, regular</p>
        <h4>VRMS h4</h4>
        <p className={'dev-comment'}>h4 Header: 15px, bold</p>
        <h5>VRMS h5</h5>
        <p className={'dev-comment'}>h5 Header: 14px, semi-bold</p>
      </div>

      {/*** TEXT / LINKS ***/}
      <div className={'link-container'}>
        <h1 className={'kit-sec-title'}>*** TEXT / LINKS ***</h1>
        <p>Text content</p>
        <p className={'dev-comment'}>Main text: 'Open Sans', 14px, regular</p>
        <p className={'italic'}>Text content</p>
        <p className={'dev-comment'}>Main text: 'Open Sans', 14px, italic</p>
        <a key={'default-link'} href={'/'}>
          Link to click here
        </a>
        <p className={'dev-comment'}>Default Link: 14px, semi-bold</p>
        <a className={'join-link'} href={'/'}>
          Join new project <span className={'join-plus'}>+</span>
        </a>
        <p className={'dev-comment'}>Join Link: 24px, bold</p>

        <div className={'project-link'}>
          <img
            src={projectIcon}
            className={'project-link-icon'}
            alt="project-link"
          />
          <span className={'project-link-name'}>311 Data Project</span>
        </div>
        <p className={'dev-comment'}>Project Link: 24px, semi-bold</p>
      </div>

      {/*** BUTTONS ***/}
      <div className={'button-container'}>
        <h1 className={'kit-sec-title'}>*** BUTTONS ***</h1>
        <Button content={`Sign In`} />
        <p className={'dev-comment'}>
          Primary default button, use without class
        </p>
        <Button content={`Sign In`} className={'btn-accent'} />
        <p className={'dev-comment'}>
          Accent button, use with class .btn-accent
        </p>
        <Button content={`Sign In`} className={'btn-square'} />
        <p className={'dev-comment'}>
          Square button, use with class .btn-square
        </p>
        <button className={'btn-confirm'}>
          <img src={confirmIcon} className={'btn-icon'} alt={'confirm'} />
          Confirm
        </button>
        <p className={'dev-comment'}>
          Confirm button, use with class .btn-confirm
        </p>
      </div>

      {/*** MENU ***/}
      <div className={'menu-container'}>
        <h1 className={'kit-sec-title'}>*** MENU ***</h1>
        <div className={'menu-item'}>
          <img src={homeIcon} className={'menu-icon'} alt="home" />
          <span className={'menu-name'}>Dashboard</span>
        </div>
        <p className={'dev-comment'}>Menu Item</p>
      </div>

      {/*** INPUTS ***/}
      <div className={'inputs-container'}>
        <h1 className={'kit-sec-title'}>*** INPUTS ***</h1>
        <div className={'text-field-container'}>
          <input
            type="text"
            name="text-field"
            placeholder={'Enter your email'}
          />
        </div>
        <p className={'dev-comment'}>Default Input</p>
      </div>

      <div className={'text-field-icon-container'}>
        <img src={gitHubIcon} className={'text-field-icon'} alt={'gitHub'} />
        <input
          type="text"
          name="text-icon-field"
          placeholder={`GitHub user name (not email)`}
        />
      </div>
      <p className={'dev-comment'}>Input with icon</p>
    </div>
  );
};

export default DevUiKit;
