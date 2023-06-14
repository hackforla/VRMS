

export const simpleInputs = [
  {
    label: 'Project Name',
    name: 'name',
    type: 'text',
    placeholder: 'Enter project name',
  },
  {
    label: 'Project Description',
    name: 'description',
    type: 'textarea',
    placeholder: 'Enter project description',
  },
  {
    label: 'Location',
    name: 'location',
    type: 'text',
    placeholder: 'Enter project location',
  },
  // Leaving incase we want to add this back in for updating projects
  // {
  //   label: 'GitHub Identifier',
  //   name: 'githubIdentifier',
  //   type: 'text',
  //   placeholder: 'Enter GitHub identifier',
  // },
  {
    label: 'GitHub URL',
    name: 'githubUrl',
    type: 'text',
    placeholder: 'htttps://github.com/',
  },
  {
    label: 'Slack Channel Link',
    name: 'slackUrl',
    type: 'text',
    placeholder: 'htttps://slack.com/',
  },
  {
    label: 'Google Drive URL',
    name: 'googleDriveUrl',
    type: 'text',
    placeholder: 'htttps://drive.google.com/',
  },
  // Leaving incase we want to add this back in for updating projects
  // {
  //   label: 'HFLA Website URL',
  //   name: 'hflaWebsiteUrl',
  //   type: 'text',
  //   placeholder: 'htttps://hackforla.org/projects/',
  // },
];

export const projectLocationValidation = {
    label: 'Location',
    name: 'location',
    type: 'text',
    placeholder: 'Enter project location',
    validation: {
        required: true,
        message: 'Location is required'
    },
    pattern: {
        value: /https:\/\/[\w-]*\.?zoom.us\/(j|my)\/[\d\w?=-]+/g,
        message: "Zoom URL is not valid"
    }
}




 {simpleInputs.map((input) => (
              <Box sx={{ mb: 1 }} key={input.name}>
                <Grid container alignItems="center">
                  <Grid item xs="auto" sx={{ pr: 3 }}>

                    <InputLabel
                      sx={{ width: 'max-content', ml: 0.5, mb: 0.5 }}
                      id={input.name}
                    >
                      {input.label}
                    </InputLabel>
                  </Grid>

                  {input.name === 'location' && locationRadios}
                </Grid>

                <TextField
                  id={input.name}
                  name={input.name}
                  placeholder={
                    input.name === 'location'
                      ? locationType === 'remote'
                        ? 'Enter project zoom link'
                        : 'Enter project street address'
                      : input.placeholder
                  }
                  variant="outlined"
                  type={input.type}
                  onChange={handleChange}
                  helperText=" "
                  value={formData[input.name]}
                  {...(input.type === 'textarea' && {
                    multiline: true,
                    minRows: 3,
                    sx: {
                      '& .MuiInputBase-root': {
                        px: '4px',
                        py: '5px',
                      },
                    },
                  })}
                />

              </Box>
            ))}