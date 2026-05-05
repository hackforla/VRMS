import { CircularProgress, Grid, Button } from '@mui/material';

const ButtonGroup = ({
  btnName1,
  btnName2,
  callBackFn1,
  callBackFn2,
  isLoading,
}) => (
  <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
    <Grid item xs="auto">
      <Button
        size="large"
        variant="contained"
        sx={{ width: '150px', cursor: 'pointer' }}
        onClick={(btn) => callBackFn1(btn)}
      >
        {isLoading ? <CircularProgress /> : `${btnName1}`}
      </Button>
    </Grid>
    <Grid item xs="auto">
      <Button
        size="large"
        variant="contained"
        sx={{ width: '150px', cursor: 'pointer' }}
        onClick={callBackFn2}
      >
        {btnName2}
      </Button>
    </Grid>
  </Grid>
);

export default ButtonGroup;
