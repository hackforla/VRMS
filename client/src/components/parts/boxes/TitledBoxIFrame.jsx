import React, { useState } from 'react';
import TitledBox from './TitledBox';
import { Box, Typography, Tooltip, Button, Link } from '@mui/material';
import InfoIcon from '../../../svg/InfoIcon.svg?react';

/**
 * A specialized TitledBox component for iframe-related content, with an expandable accordion and "Add New Event" badge.
 * @param {Object} props - The props object.
 * @param {Function} props.setIsCreateNew - Function to set the create new state.
 * @param {string} props.projectName - The project name to pre-fill in the forms (e.g., "311Data").
 * @returns {JSX.Element} The rendered TitledBoxIFrame component.
 */
export default function TitledBoxIFrame({ setIsCreateNew, projectName }) {
  const [formState, setFormState] = useState('hidden');

  const onOffBoardingLogLink =
    'https://github.com/hackforla/product-management/issues/391';

  const onboardingIframeSrc = `https://docs.google.com/forms/d/e/1FAIpQLSdKbq_tO0C1nLMz4XzdmFFzt3GufTs35xy83MieQj-fUlj6vA/viewform?usp=pp_url&entry.872097547=${encodeForGoogleForms(
    projectName
  )}&embedded=true`;
  const offboardingIframeSrc = `https://docs.google.com/forms/d/e/1FAIpQLSftp0txQkJWIwbxFTD4-w5rrq6kI8L06sHw0dvs_CmOD-4PHg/viewform?usp=pp_url&entry.1212778706=${encodeForGoogleForms(
    projectName
  )}&embedded=true`;

  const iframeWidth = 380;
  const iframeHeight = 1000;

  return (
    <TitledBox
      title="Onboarding/Offboarding Forms"
      expandable={true}
      badge={
        <Tooltip
          title="To access this form, please log in to your project's @hackforla.org email account."
          slotProps={{ tooltip: { sx: { fontSize: '1.2rem' } } }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': { color: 'red', cursor: 'pointer' },
            }}
            onClick={() => setIsCreateNew(true)}
          >
            <InfoIcon style={{ marginRight: '7px' }} />
          </Box>
        </Tooltip>
      }
    >
      <Box>
        <FormButtons formState={formState} setFormState={setFormState} />
        <FormIframes
          formState={formState}
          onboardingIframeSrc={onboardingIframeSrc}
          offboardingIframeSrc={offboardingIframeSrc}
          iframeWidth={iframeWidth}
          iframeHeight={iframeHeight}
        />
        <OffboardingLink onOffBoardingLogLink={onOffBoardingLogLink} />
      </Box>
    </TitledBox>
  );
}

const FormButtons = ({ formState, setFormState }) => (
  <Box sx={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
    <Button
      onClick={() => setFormState('onboarding')}
      sx={{
        flex: 1,
        padding: '5px 10px',
        backgroundColor: formState === 'onboarding' ? 'lightblue' : '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Onboarding Form
    </Button>
    <Button
      onClick={() => setFormState('offboarding')}
      sx={{
        flex: 1,
        padding: '5px 10px',
        backgroundColor: formState === 'offboarding' ? 'lightblue' : '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Offboarding Form
    </Button>
  </Box>
);

const FormIframes = ({
  formState,
  onboardingIframeSrc,
  offboardingIframeSrc,
  iframeWidth,
  iframeHeight,
}) => (
  <Box>
    <iframe
      src={onboardingIframeSrc}
      width={iframeWidth}
      height={iframeHeight}
      style={{
        border: 'none',
        display: formState === 'onboarding' ? 'block' : 'none',
      }}
    >
      Loading…
    </iframe>
    <iframe
      src={offboardingIframeSrc}
      width={iframeWidth}
      height={iframeHeight}
      style={{
        border: 'none',
        display: formState === 'offboarding' ? 'block' : 'none',
      }}
    >
      Loading…
    </iframe>
  </Box>
);

const OffboardingLink = ({ onOffBoardingLogLink }) => (
  <Box sx={{ marginTop: '10px', marginBottom: '10px' }}>
    <Typography
      variant="h3"
      sx={{
        fontWeight: 'bold',
        fontSize: '1.3rem',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
    >
      These actions are logged in the:
    </Typography>
    <Link
      href={onOffBoardingLogLink}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        marginBottom: '10px',
        marginLeft: '10px',
        textDecoration: 'underline',
        color: 'blue',
      }}
    >
      On / Offboarding Log
    </Link>
  </Box>
);

/**
 * Encodes a string for Google Forms URLs, converting spaces to + and encoding other special characters.
 * @param {string} str - The string to encode.
 * @returns {string} The encoded string.
 */
function encodeForGoogleForms(str) {
  return encodeURIComponent(str).replace(/%20/g, '+');
}
