import axios from 'axios'
import { toastr } from 'react-redux-toastr';
import { reset, initialize, change } from 'redux-form';
import { BASE_URL } from '../env';
import dateFormat from 'dateformat'

const INITIAL_DATA = {};

export function getList() {
    const request = axios.get(`${BASE_URL}/party`)
    return {
        type: 'PARTY_FETCHED',
        payload: request
    }
}

export async function setParty(values) {
    let method = 'post';
    if (values.party_id) {
        method = 'put';
    }
    return async dispatch => {
        const request = await axios[method](`${BASE_URL}/party`, values)
        const partyId = request.data.party_id
        toastr.success('Sucesso', 'Operação realizada com sucesso');
        return { type: 'PARTY_SAVED', payload: partyId }
    }
}

export async function getPartyById(id) {
    const request = await axios.get(`${BASE_URL}/party/getById/${id}`)
    return dispatch => {
        const data = request.data[0];
        const formData = {
            ...data,
            birth_date: data.birth_date && dateFormat(data.birth_date, "yyyy-mm-dd")
        }
        dispatch(initialize('partyForm', formData))
        return { type: 'PARTY_BY_ID_FETCHED', payload: formData }
    }
}

export async function updateParty(partyData) {
    const request = await axios.put(`${BASE_URL}/party`, partyData)
    return dispatch => {
        return { type: 'PARTY_UPDATED', payload: request.data[0] }
    }
}

export function initializeForm(data = INITIAL_DATA) {
    return dispatch => {
        dispatch(initialize("partyForm", data))
    }
}

export async function deleteParty(id) {
    return async dispatch => {
        const request = await axios.delete(`${BASE_URL}/party/${id}`)
        if (request.data.error) {
            toastr.error('Erro', request.data.error);
        }
        return { type: 'PARTY_DELETED', payload: request.data[0] }
    }
}

export function initPartyForm() {
    return dispatch => dispatch(reset('partyForm'));
}

