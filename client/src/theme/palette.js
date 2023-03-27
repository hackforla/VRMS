export const applyAlpha = (alpha, color) => color + alpha;

const grayscale = [
    '#FFFFFF', //0 
    '#F1F1F1', //1 
    '#AAAAAA', //2 
    '#333333', //3
    '#757575', //4 
    '#000000', //5 
];

export const uiKitColors = {
    primary: '#00008B',
    secondary: '#FA114F',
    success: '#008000',
    error: '#FF0000',
    white: grayscale[0],
    black: grayscale[5],
    grayscale
}

const palette = {
  type: 'light',
  white: uiKitColors.white,
  black: uiKitColors.black,
  primary: {
    main: uiKitColors.primary,
  },
  secondary: {
    main: uiKitColors.secondary,
  },
  success: {
    main: uiKitColors.success,
  },
  error: {
    main: uiKitColors.error,
  },
  background: {
    default: uiKitColors.white,
    paper: uiKitColors.grayscale[1],
  },
};

export default palette;
