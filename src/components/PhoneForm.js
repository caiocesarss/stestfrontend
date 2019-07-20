import React, { Component } from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import { defaultClass } from './common/Constants';
import PropTypes from 'prop-types';
import { reduxForm, Field, change } from 'redux-form';

import Button from '@material-ui/core/Button';

import { setPhone, initializeForm, getPhoneById } from '../redux/PhoneActions';
import PageHeader from './template/PageHeader';
import PhoneInput from './common/PhoneInput';

const styles = defaultClass

class PhoneForm extends Component {
    componentWillMount() {
        this.props.initializeForm();
        const { match: { params } } = this.props;
        if (params.party_id){
            this.props.dispatch(change("phoneForm", "party_id", params.party_id));
        }
   
        if (params.phone_id) {
            this.props.getPhoneById(params.phone_id);
            this.props.dispatch(change("phoneForm", "phone_id", params.phone_id));
        }
    }

    render() {
        const { forwardedRef, ...props } = this.props;
        const { classes, handleSubmit, phoneParty } = this.props;
        const partyName = phoneParty && phoneParty.party_name || '';
        const title = partyName && "Incluir Telefone" || "Alterar Telefone"
        return (
            <div className={classes.content} ref={forwardedRef}>

                <PageHeader
                    title={title}
                    subtitle={partyName && `Cliente: ${partyName}`}
                />
                <form role="form" onSubmit={handleSubmit(async data => {
                    const result = await this.props.setPhone(data)
                    this.props.history.push(`/pessoa/fones/${phoneParty.party_id}`);
                })
                }>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={3}>
                                <Field name="party_id"
                                    type="hidden"
                                    component="input"
                                />
                                <Field name="phone_id"
                                    type="hidden"
                                    component="input"
                                />
                                <Field
                                    name="phone_number"
                                    textField={{ fullWidth: true }}
                                    component={PhoneInput}
                                    label="Número"

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

PhoneForm.propTypes = {
    classes: PropTypes.object.isRequired
};
PhoneForm = reduxForm({ form: 'phoneForm', destroyOnUnmount: false })(PhoneForm);

const mapStateToPropos = state => ({
    phoneParty: state.phone.phoneParty,
    phoneById: state.phone.phoneById
});
const mapDispatchToProps = (dispatch, ownProps) =>
    bindActionCreators({
        setPhone,
        change,
        initializeForm,
        getPhoneById
    }, dispatch);

PhoneForm = connect(mapStateToPropos, mapDispatchToProps)(PhoneForm)

const Comp = withStyles(styles)(PhoneForm)
export default
    React.forwardRef((props, ref) => <Comp {...props} forwardedRef={ref} />);