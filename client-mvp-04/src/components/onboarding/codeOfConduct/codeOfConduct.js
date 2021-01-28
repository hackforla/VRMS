import Markdown from 'markdown-to-jsx';
import React, { useEffect, useState } from 'react';
import './codeOfConduct.scss';
import { getCodeOfConductContent } from '../../../services/data.service';
import ProgressBar from '../../common/progressBar/progressBar';
import Loader from '../../common/loader/loader';

const CodeOfConduct = () => {
  // 2nd step of onboarding process
  const [isLoaded, setIsLoaded] = useState(false);
  const [codeOfConductText, setCodeOfConductText] = useState('');

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

  useEffect(() => {
    getCodeOfConductContent().then((res) => extractTextContent(res));
  }, []);

  return (
    <>
      <div className="code-of-conduct">
        <h5>Code of conduct</h5>

        {isLoaded ? (
          <Markdown className="code-of-conduct-content custom-scroll-bar">
            {codeOfConductText}
          </Markdown>
        ) : (
          <Loader />
        )}
      </div>

      <ProgressBar total={6} active={2} />
    </>
  );
};

export default CodeOfConduct;
