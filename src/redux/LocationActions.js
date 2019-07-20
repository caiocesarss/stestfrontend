import axios from 'axios'
import { toastr } from 'react-redux-toastr';
import { reset as resetForm, initialize } from 'redux-form';
import { BASE_URL } from '../env';


const INITIAL_DATA = {}

export async function getUF() {
    const request = await axios.get(`${BASE_URL}/uf`)
    return {
        type: 'UF_FETCHED',
        payload: request
    }
}

export async function getCitiesByUF(ufId) {
    const request = await axios.get(`${BASE_URL}/city/${ufId}`)
    return {
        type: 'CITIES_FETCHED',
        payload: request
    }
}

export async function getLocationParty(id) {
    const request = await axios.get(`${BASE_URL}/party/getById/${id}`)
    return { type: 'PARTY_FETCHED', payload: request.data[0] }
}

export async function getLocationById(id){
    return async dispatch => {
        const request = await axios.get(`${BASE_URL}/location/locationById/${id}`)
        dispatch(initializeForm(request.data[0]))
        dispatch ({ type: 'LOCATION_BY_ID_FETCHED', payload: request.data[0] })
    }
}

export async function getLocationsByPartyId(partyId){
    const request = await axios.get(`${BASE_URL}/location/${partyId}`);
    return {
        type: 'PARTY_LOCATIONS_FETCHED',
        payload: request
    }
}

export function setLocation(values){
    let method = 'post';
    if (values.location_id){
        method = 'put';
    }
    return async dispatch => {
        const request = await axios[method](`${BASE_URL}/location`, values)
        return { type: 'LOCATION_SAVED', payload: request }
    }
}

export async function deleteLocation(id) {
    return async dispatch => {
        const request = await axios.delete(`${BASE_URL}/location/${id}`)
        if (request.data.error) {
            toastr.error('Erro', request.data.error);
        }
        return { type: 'LOCATION_DELETED', payload: request.data[0] }
    }
}

export function initializeForm(data = INITIAL_DATA) {
    return dispatch => {
        dispatch(initialize("locationForm", data))
    }
}
