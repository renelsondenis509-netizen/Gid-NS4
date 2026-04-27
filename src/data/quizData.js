import { QUIZ_DATA as BASE } from './quizDataBase.js';
import { QUIZ_DATA_NEW as NEW } from './quizDataNew.js';

export const QUIZ_DATA = { ...BASE, ...NEW };

export const QUIZ_BRANCHES = {
  SVT: { label:"SVT", color:"#22c55e", subjects:["Biologie","Géologie","Chimie"] },
  SES: { label:"SES", color:"#f59e0b", subjects:["Histoire","Géographie","Économie","Philosophie"] },
  SMP: { label:"SMP", color:"#3b82f6", subjects:["Analyse","Algèbre","Suite","Complexe","Probabilité","Géométrie","Physique"] },
  LLA: { label:"LLA", color:"#a855f7", subjects:["Créole","Français","Anglais","Espagnol","Dissertation","Littérature Haïtienne","Littérature Française","Éducation Esthétique et Artistique","Éducation Physique et Sportive","Éducation à la Citoyenneté","Numérique et Informatique"] },
};
