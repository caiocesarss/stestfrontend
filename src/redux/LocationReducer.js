const INITIAL_STATE = {
    cityList: [],
    UFList: [],
    locationList: [],
    locationParty: []
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "CITIES_FETCHED":
            return { ...state, cityList: action.payload.data }
        case "UF_FETCHED":
            return { ...state, UFList: action.payload.data }
        case "PARTY_LOCATIONS_FETCHED":
            return { ...state, locationList: action.payload.data }
        case "PARTY_FETCHED":
            return { ...state, locationParty: action.payload }
        default:
            return state
    }
}