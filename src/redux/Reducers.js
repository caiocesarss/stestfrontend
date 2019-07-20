import { combineReducers } from 'redux'
import {reducer as formReducer } from 'redux-form';
import {reducer as toastrReducer} from 'react-redux-toastr'

import PartyReducer from './PartyReducer';
import LocationReducer from './LocationReducer';
import PhoneReducer from './PhoneReducer';

const rootReducer = combineReducers ({
    party: PartyReducer,
    location: LocationReducer,
    phone: PhoneReducer,
    form: formReducer,
    toastr: toastrReducer
})

export default rootReducer