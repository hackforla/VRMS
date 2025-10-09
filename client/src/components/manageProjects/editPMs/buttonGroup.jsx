import { CircularProgress, Grid } from "@mui/material";
import { StyledButton } from '../../ProjectForm';

const ButtonGroup = ({ btnName1, btnName2, callBackFn1, callBackFn2, isLoading }) => (
  <Grid container justifyContent="space-evenly" sx={{ my: 3 }}>
    <Grid item xs="auto">
      <StyledButton
        sx="large"
        cursor="pointer"
        variant="contained"
        onClick={(btn) => callBackFn1(btn)}
      >
        {isLoading ? <CircularProgress /> : `${btnName1}`}
      </StyledButton>
    </Grid>
    <Grid item xs="auto">
      <StyledButton
        sx="large"
        cursor="pointer"
        variant="contained"
        onClick={callBackFn2}
      >
        {btnName2}
      </StyledButton>
    </Grid>
  </Grid>
);

export default ButtonGroup