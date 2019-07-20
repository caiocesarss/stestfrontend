const INITIAL_STATE = {
    phoneList: [],
    phoneParty: [],
    phoneById: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "PARTY_PHONES_FETCHED":
            return { ...state, phoneList: action.payload.data }
        case "PARTY_FETCHED":
            return { ...state, phoneParty: action.payload }
            case "PHONE_BY_ID_FETCHED":
            return { ...state, phoneParty: action.payload }
        default:
            return state
    }
}