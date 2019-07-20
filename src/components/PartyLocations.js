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
import { getLocationsByPartyId, getLocationParty, deleteLocation } from '../redux/LocationActions';
import { defaultClass } from './common/Constants';
import { tableOptions } from '../env';

const styles = defaultClass

class PartyLocations extends Component {

    componentWillMount() {
        const { match: { params } } = this.props;

        this.props.getLocationsByPartyId(params.party_id);
        this.props.getLocationParty(params.party_id);
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
        const list = this.props.locationList
        selectedRows.data.map(val => {
            const dataIndex = val.dataIndex;
            this.props.deleteLocation(list[dataIndex].location_id);
        })
        return true;
    }


    render() {
        const { forwardedRef, ...props } = this.props;
        const { classes } = this.props;
        const locationParty = this.props.locationParty;
        const locationList = this.props.locationList || [];
        const { match: { params } } = this.props;


        const columns = [
            {
                name: "location_id",
                options: {
                    display: false
                }
            },
            {
                name: "address_line",
                label: "Logradouro",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "number",
                label: "Número",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "zip_code",
                label: "CEP",
                options: {
                    filter: true,
                    sort: false
                },
            },
            {
                name: "city_name",
                label: "Cidade",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "uf",
                label: "UF",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            {
                label: "Ações",
                options: {
                    filter: true,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        const locationId = tableMeta.rowData ? tableMeta.rowData[0] : '';
                        return (
                            <Link component={RouterLink} to={`/pessoa/locais/alterar/${locationId}`}>
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
                    title="Locais"
                    subtitle="Cadastro de Locais"
                    linkTo={`/pessoa/locais/detalhes/${params.party_id}`}
                    buttonType="primary"
                    showPageHeaderRight={true}
                />
                <Grid item xs={12}>
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title={`Cliente: ${locationParty.party_name || ''} `}
                            data={locationList}
                            columns={columns}
                            options={{ ...tableOptions, onRowsDelete: data => this.rowDelete(data) }}
                        />
                    </MuiThemeProvider>
                </Grid>


            </main>
        )
    }

}

PartyLocations.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToPropos = state => ({
    locationList: state.location.locationList,
    locationParty: state.location.locationParty
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ getLocationsByPartyId, getLocationParty, deleteLocation }, dispatch);

PartyLocations = connect(mapStateToPropos, mapDispatchToProps)(PartyLocations)

const Comp = withStyles(styles)(PartyLocations)
export default
    React.forwardRef((props, ref) => <Comp {...props} forwardedRef={ref} />);
