import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import MUIDataTable from "mui-datatables";
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { Edit as EditIcon } from '@material-ui/icons';
import Link from '@material-ui/core/Link';

import PageHeader from './template/PageHeader';
import { getPhonesByPartyId, getPhonesParty, deletePhone } from '../redux/PhoneActions';
import { defaultClass } from './common/Constants';
import { tableOptions } from '../env';

const styles = defaultClass

class PartyPhones extends Component {

    componentWillMount() {
        const { match: { params } } = this.props;

        this.props.getPhonesByPartyId(params.party_id);
        this.props.getPhonesParty(params.party_id);
    }

    getMuiTheme = () => createMuiTheme({
        overrides: {
            MUIDataTable: {
                root: {
                    backgroundColor: "#FF000",

                },
                paper: {
                    boxShadow: "none",

                }
            },
            MUIDataTableBodyCell: {
                root: {
                    backgroundColor: "#FFF"
                }
            }
        }
    });

    rowDelete (selectedRows) {
        const list = this.props.phoneList
        selectedRows.data.map(val => {
            const dataIndex = val.dataIndex;
            this.props.deletePhone(list[dataIndex].phone_id);
        })
        return true;
    }

    render() {
        const { forwardedRef, ...props } = this.props;
        const { classes } = this.props;
        const phoneParty = this.props.phoneParty;
        const phoneList = this.props.phoneList || [];
        const { match: { params } } = this.props;

        const columns = [
            {
                name: "phone_id",
                options: {
                    display: false
                }
            },
            {
                name: "phone_number",
                label: "Número",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                label: "Ações",
                options: {
                    filter: true,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        const phoneId = tableMeta.rowData ? tableMeta.rowData[0] : '';
                        return (
                            <Link component={RouterLink} to={`/pessoa/fones/alterar/${phoneId}`}>
                                <IconButton size="small" aria-label="Edit">
                                    <EditIcon />
                                </IconButton>
                            </Link>
                        );
                    }
                }
            },
        ];

        return (

            <main className={classes.content}>
                <PageHeader
                    title="Telefones"
                    subtitle="Cadastro de Números"
                    linkTo={`/pessoa/fones/detalhes/${params.party_id}`}
                    buttonType="primary"
                    showPageHeaderRight={true}
                />

                <Grid item xs={12}>
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title={`Cliente: ${phoneParty.party_name || ''} `}
                            data={phoneList}
                            columns={columns}
                            options={{ ...tableOptions, onRowsDelete: data => this.rowDelete(data) }}
                        />
                    </MuiThemeProvider>
                </Grid>


            </main>
        )
    }

}

PartyPhones.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToPropos = state => ({
    phoneList: state.phone.phoneList,
    phoneParty: state.phone.phoneParty
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ getPhonesByPartyId, getPhonesParty, deletePhone }, dispatch);

PartyPhones = connect(mapStateToPropos, mapDispatchToProps)(PartyPhones)

const Comp = withStyles(styles)(PartyPhones)
export default
    React.forwardRef((props, ref) => <Comp {...props} forwardedRef={ref} />);
