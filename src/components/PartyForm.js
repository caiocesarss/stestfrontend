import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import { defaultClass } from '../components/common/Constants';
import PropTypes from 'prop-types';
import { reduxForm, Field, change } from 'redux-form';
import Button from '@material-ui/core/Button';
import { createTextMask } from 'redux-form-input-masks';
import CPF from 'cpf-check';

import LabelAndInput from './common/LabelAndInput';
import PageHeader from './template/PageHeader';
import { setParty, initializeForm, getPartyById } from '../redux/PartyActions';
import LocationForm from './LocationForm';
import If from './common/If';
import DateFieldNative from './common/DateFieldNative';

const styles = defaultClass

class Partyform extends Component {
    componentWillMount() {
        const { match: { params } } = this.props;
        this.props.initializeForm();
        if (params.party_id) {
            this.props.getPartyById(params.party_id);
        }
    }

    render() {
        const { forwardedRef, ...props } = this.props;
        const { classes, handleSubmit } = this.props;
        const { match: { params } } = this.props;

        const DocMask = createTextMask({
            pattern: '999.999.999-99',
            stripMask: false,
            guide: false
        });

        const email = value =>
            value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
                'E-mail inválido!' : undefined;

        const vcpf = value => {
            return value && value.length > 13 && !CPF.validate(CPF.strip(value)) ? 'CPF Inválido' : undefined;
        }

        return (
            <div className={classes.content}>
                <PageHeader
                    title="Pessoa"
                    subtitle="Cadastro de Pessoa"
                    buttonType="primary"
                />

                <Grid item xs={12}>
                    <form role="form" onSubmit={handleSubmit(async data => {
                        const result = await this.props.setParty(data)
                        this.props.history.push("/pessoa");
                    })
                    }>
                        <Grid container spacing={1}>
                            <Grid item xs={6} md={3}>
                                <Field name="party_name"
                                    textField={{ fullWidth: true }}
                                    component={LabelAndInput}
                                    label="Nome" />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Field
                                    name="cpf"
                                    textField={{ fullWidth: true }}
                                    component={LabelAndInput}
                                    label="Número CPF"
                                    validate={vcpf}
                                    {...DocMask}
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Field name="email"
                                    textField={{ fullWidth: true }}
                                    component={LabelAndInput}
                                    validate={email}
                                    label="E-mail" />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <Field
                                    name="birth_date"
                                    label="Data de Nascimento"
                                    textField={{ fullWidth: true }}
                                    component={DateFieldNative}
                                />
                            </Grid>
                        </Grid>
                        <If test={!params.party_id}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <LocationForm />
                                </Grid>
                            </Grid>
                        </If>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={12}>
                                <Button size="large" color="primary" type="submit" variant="contained" className={classes.button}>Enviar</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </div>
        )
    }
}

Partyform.propTypes = {
    classes: PropTypes.object.isRequired
};

Partyform = reduxForm({ form: 'partyForm', destroyOnUnmount: false })(Partyform);
const mapStateToPropos = state => ({
    newPartyId: state.party.newPartyId
});
const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
        setParty,
        initializeForm,
        getPartyById,
        change
    }, dispatch);

Partyform = connect(mapStateToPropos, mapDispatchToProps)(Partyform)

const Comp = withStyles(styles)(Partyform)
export default
    React.forwardRef((props, ref) => <Comp {...props} forwardedRef={ref} />);