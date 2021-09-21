import { PREVIOUS, NEXT, CLEAR_STEP, SET_STEP } from "./constants";

export const previousStep = () => ({ type: PREVIOUS });

export const nextStep = () => ({ type: NEXT });

export const clearStep = () => ({ type: CLEAR_STEP });

export const setStep = (step) => ({ type: SET_STEP, step });
