import { PREVIOUS, NEXT, CLEAR } from "../constants";

export const previousStep = () => ({ type: PREVIOUS });

export const nextStep = () => ({ type: NEXT });

export const clearStep = () => ({ type: CLEAR });
