import { CODE_OF_CONDUCT } from '../utils/endpoints';

export async function getCodeOfConductContent() {
  try {
    const response = await fetch(CODE_OF_CONDUCT, {
      method: 'GET',
    });
    return await response.text();
  } catch (error) {
    console.log("Couldn't fetch code of conduct data");
    console.log(error);
    return null;
  }
}
