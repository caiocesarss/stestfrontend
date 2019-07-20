import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import { defaultClass } from './common/Constants';
import PropTypes from 'prop-types';
import { reduxForm, Field, change } from 'redux-form';
import { createTextMask } from 'redux-form-input-masks';
import Button from '@material-ui/core/Button';

import LabelAndInput from './common/LabelAndInput';
import InputSelect from './common/InputSelect';

import { getUF, getCitiesByUF, setLocation, getLocationById, initializeForm } from '../redux/LocationActions';
import PageHeader from './template/PageHeader';

const styles = defaultClass

class LocationDetail extends Component {
    componentWillMount() {
        this.props.initializeForm();
        const { match: { params } } = this.props;
        this.props.getUF();
        if (params.party_id){
            this.props.dispatch(change("locationForm", "party_id", params.party_id));
        }
        if (params.location_id){
                this.props.getLocationById(params.location_id);
                this.props.dispatch(change("locationForm", "location_id", params.location_id));
        }
    }

    render() {
        const { forwardedRef, ...props } = this.props;
        const { classes, handleSubmit, locationParty } = this.props;
        const UFData = this.props.UFList;
        const selectUF = UFData.map(item => {
            return ({ name: item.code, id: item.uf_id })
        }) || [];

        const cityData = this.props.cityList;
        const selectCity = cityData.map(item => {
            return ({ name: item.name, id: item.city_id })
        })

        const zipMask = createTextMask({
            pattern: '99.999-999',
            stripMask: false,
            guide: false
        });

        const title = locationParty.party_name && "Incluir Local" || "Alterar Local"


        return (
            <div className={classes.content} ref={forwardedRef}>

                <PageHeader
                    title={title}
                    subtitle={`Cliente: ${locationParty.party_name || ''}`}
                />
                <form role="form" onSubmit={handleSubmit(async data => {
                    const result = await this.props.setLocation(data)
                    this.props.history.push(`/pessoa/locais/${locationParty.party_id}`);
                })
                }>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={3}>
                                <Field name="party_id"
                                    type="hidden"
                                    component="input"
                                />
                                <Field name="location_id"
                                    type="hidden"
                                    component="input"
                                />
                                <Field
                                    name="address_line"
                                    textField={{ fullWidth: true }}
                                    component={LabelAndInput}
                                    label="Rua/Logradouro"
                                />
                            </Grid>
                            <Grid item xs={12} md={1}>
                                <Field
                                    name="number"
                                    textField={{ fullWidth: true }}
                                    component={LabelAndInput}
                                    label="Número"
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Field
                                    name="district"
                                    textField={{ fullWidth: true }}
                                    component={LabelAndInput}
                                    label="Bairro"
                                />
                            </Grid>
                            <Grid item xs={12} md={1}>
                                <Field
                                    name="zip_code"
                                    textField={{ fullWidth: true }}
                                    component={LabelAndInput}
                                    label="CEP"
                                    {...zipMask}
                                />
                            </Grid>
                            <Grid item xs={12} md={1}>
                                <Field
                                    name="uf_id"
                                    component={InputSelect}
                                    selectField={{ fullWidth: true }}
                                    inputProps={{ name: 'uf', id: 'seluf' }}
                                    selectItems={selectUF}
                                    onChange={data => this.props.getCitiesByUF(data.target.value)}
                                    label="UF"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Field
                                    name="city_id"
                                    component={InputSelect}
                                    selectField={{ fullWidth: true }}
                                    inputProps={{ name: 'city', id: 'selcity' }}
                                    selectItems={selectCity}
                                    label="Cidade"
                                />
                            </Grid>

                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={12}>
                                <Button size="large" color="primary" type="submit" variant="contained" className={classes.button}>Enviar</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </div>
        )
    }
}

LocationDetail.propTypes = {
    classes: PropTypes.object.isRequired
};
LocationDetail = reduxForm({ form: 'locationForm', destroyOnUnmount: false })(LocationDetail);

const mapStateToPropos = state => ({
    UFList: state.location.UFList,
    cityList: state.location.cityList,
    locationParty: state.location.locationParty
});
const mapDispatchToProps = (dispatch, ownProps) =>
    bindActionCreators({
        getUF,
        getCitiesByUF,
        setLocation,
        getLocationById,
        initializeForm,
        change
    }, dispatch);

LocationDetail = connect(mapStateToPropos, mapDispatchToProps)(LocationDetail)

const Comp = withStyles(styles)(LocationDetail)
export default
    React.forwardRef((props, ref) => <Comp {...props} forwardedRef={ref} />);