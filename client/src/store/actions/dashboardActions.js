import { OPEN_MENU, CLOSE_MENU } from './types';

const openMenu = () => ({ type: OPEN_MENU });
const closeMenu = () => ({ type: CLOSE_MENU });

export default {
  openMenu,
  closeMenu,
};
