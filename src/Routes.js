import React from "react";
import { Switch, Route, Redirect } from 'react-router';

import Home from './components/Home';

import Party from "./components/Party";
import PartyForm from "./components/PartyForm";
import PartyLocations from "./components/PartyLocations";
import LocationDetail from  "./components/LocationDetail";
import PartyPhones from "./components/PartyPhones";
import PhoneForm from "./components/PhoneForm";



export default props => {
    return (
        <Switch>
            <Route
                path="/"
                exact
                component={Home}
            />
            <Route exact path="/pessoa" component={Party} />
            <Route exact path="/pessoa/incluir" component={PartyForm} />
            <Route exact path="/pessoa/locais/:party_id" component={PartyLocations} />
            <Route exact path="/pessoa/locais/detalhes/:party_id" component={LocationDetail} />
            <Route exact path="/pessoa/locais/alterar/:location_id" component={LocationDetail} />
            <Route exact path="/pessoa/fones/:party_id" component={PartyPhones} />
            <Route exact path="/pessoa/fones/detalhes/:party_id" component={PhoneForm} />
            <Route exact path="/pessoa/fones/alterar/:phone_id" component={PhoneForm} />
            <Route exact path="/pessoa/detalhes/:party_id" component={PartyForm} />
            <Route path="*" component={Home} />
        </Switch>
    )
}

