import axios from 'axios'
import { toastr } from 'react-redux-toastr';
import { reset as resetForm, initialize } from 'redux-form';
import { BASE_URL } from '../env';

const INITIAL_DATA = {};

export async function getPhonesParty(id) {
    const request = await axios.get(`${BASE_URL}/party/getById/${id}`)
    return { type: 'PARTY_FETCHED', payload: request.data[0] }
}

export async function getPhoneById(id){
    return async dispatch => {
        const request = await axios.get(`${BASE_URL}/phone/phoneById/${id}`)
        dispatch(initializeForm(request.data[0]))
        dispatch ({ type: 'PHONE_BY_ID_FETCHED', payload: request.data[0] })
    }
}

export async function getPhonesByPartyId(partyId){
    const request = await axios.get(`${BASE_URL}/phone/${partyId}`);
    return {
        type: 'PARTY_PHONES_FETCHED',
        payload: request
    }
}

export function setPhone(values){
    let method = 'post';
    if (values.phone_id){
        method = 'put';
    }
    return async dispatch => {
        const request = await axios[method](`${BASE_URL}/phone`, values)
        return { type: 'PHONE_SAVED', payload: request }
    }
}

export async function deletePhone(id) {
    return async dispatch => {
        const request = await axios.delete(`${BASE_URL}/phone/${id}`)
        if (request.data.error) {
            toastr.error('Erro', request.data.error);
        }
        return { type: 'PHONE_DELETED', payload: request.data[0] }
    }
}

export function initializeForm(data = INITIAL_DATA) {
    return dispatch => {
        dispatch(initialize("phoneForm", data))
    }
}