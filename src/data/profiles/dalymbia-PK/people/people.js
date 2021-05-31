import colors from '../../../styles/colors'
import { placeNames } from '../../dalymbia-DK/places';

import races from './races'
import occupations from './occupations'

import {
  gwimbledymPeople,
} from './peopleGroups'

const people = {
  ...gwimbledymPeople,
}

export const peopleAsArray = Object.values(people) 

export default people