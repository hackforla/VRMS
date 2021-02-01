import Markdown from 'markdown-to-jsx';
import React, { useEffect, useState } from 'react';
import './codeOfConduct.scss';
import { getCodeOfConductContent } from '../../../services/data.service';
import ProgressBar from '../../common/progressBar/progressBar';
import Loader from '../../common/loader/loader';
import { useHistory } from 'react-router-dom';
import Popup from '../../common/popup/popup';

const CodeOfConduct = () => {
  // 2nd step of onboarding process
  const history = useHistory();
  const popupContent =
    'You must agree to the Code of Conduct to participate in Hack for LA';
  const [isLoaded, setIsLoaded] = useState(false);
  const [codeOfConductText, setCodeOfConductText] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  function extractTextContent(markdown) {
    const startStr = markdown.indexOf('Hack for LA expects');
    const endStr = markdown.indexOf('### Email Template');
    const textFragment = markdown
      .slice(startStr, endStr)
      .replace(
        'team@hackforla.org',
        `<a href="mailto:team@hackforla.org">team@hackforla.org</a>`
      );
    setCodeOfConductText(textFragment);
    setIsLoaded(true);
  }

  function handleUserAgree() {
    // While functionality isn't implemented -> redirect to dummy page
    history.push('/page');
  }

  function closePopup(e) {
    if (
      e.target.className === 'bg-overlay active' ||
      e.target.id === 'popup-close-btn' ||
      e.target.className === 'line'
    )
      setIsPopupOpen(!isPopupOpen);
  }

  useEffect(() => {
    getCodeOfConductContent().then((res) => extractTextContent(res));
  }, []);

  return (
    <>
      <div className="code-of-conduct-container">
        <h5>Code of conduct</h5>

        {isLoaded ? (
          <Markdown className="code-of-conduct-content custom-scroll-bar">
            {codeOfConductText}
          </Markdown>
        ) : (
          <Loader />
        )}
      </div>

      <div className="code-of-conduct-buttons">
        <input
          type="button"
          value="Don’t Agree"
          onClick={() => setIsPopupOpen(!isPopupOpen)}
        />
        <input type="button" value="Agree" onClick={() => handleUserAgree()} />
      </div>

      <ProgressBar total={6} active={2} />

      <Popup
        content={popupContent}
        isPopupOpen={isPopupOpen}
        closePopup={closePopup}
      />
    </>
  );
};

export default CodeOfConduct;
