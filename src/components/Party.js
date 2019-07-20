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
import PlaceIcon from '@material-ui/icons/Place';
import EditIcon from '@material-ui/icons/Edit';
import PhoneIcon from '@material-ui/icons/Call';
import Link from '@material-ui/core/Link';
import dateFormat from 'dateformat';
import ReduxToastr from 'react-redux-toastr';

import PageHeader from './template/PageHeader';
import { defaultClass } from './common/Constants';
import { getList, deleteParty } from '../redux/PartyActions';
import { tableOptions } from '../env';


const styles = defaultClass

class Party extends Component {
  state = {
    openDialog: false,
    selectedRows: {}
  }

  componentWillMount() {
    this.props.getList();
  }

  rowDelete(selectedRows) {
    const list = this.props.list
    selectedRows.data.map(val => {
      const dataIndex = val.dataIndex;
      this.props.deleteParty(list[dataIndex].party_id);
    })
    return true;
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



  render() {
    const { forwardedRef, classes, ...props } = this.props;

    const columns = [
      {
        name: "party_id",
        options: {
          display: false
        }
      },
      {
        name: "party_name",
        label: "Nome",
        options: {
          filter: true,
          sort: true,
        }
      },
      {
        name: "cpf",
        label: "CPF",
        options: {
          filter: true,
          sort: false,

        },
      },
      {
        name: "birth_date",
        label: "Data Nascimento",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              value && dateFormat(value, "dd/mm/yyyy")

            );
          }
        }
      },
      {
        name: "created_at",
        label: "Data Registro",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              value && dateFormat(value, "dd/mm/yyyy HH:MM")

            );
          }
        }
      },
      {
        label: "Ações",
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            const partyId = tableMeta.rowData ? tableMeta.rowData[0] : '';

            return (
              <div>
                <Link component={RouterLink} to={`/pessoa/detalhes/${partyId}`}>
                  <IconButton size="small" aria-label="Edit">
                    <EditIcon />
                  </IconButton>
                </Link>
                <Link component={RouterLink} to={`/pessoa/locais/${partyId}`}>
                  <IconButton size="small" aria-label="Edit">
                    <PlaceIcon />
                  </IconButton>
                </Link>
                <Link component={RouterLink} to={`/pessoa/fones/${partyId}`}>
                  <IconButton size="small" aria-label="Edit">
                    <PhoneIcon />
                  </IconButton>
                </Link>
              </div>
            );
          }
        }
      },
    ];
    return (

      <main className={classes.content}>
        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="top-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar
          closeOnToastrClick />
        <PageHeader
          title="Pessoas"
          subtitle="Cadastro de Pessoas"
          linkTo="/pessoa/incluir"
          buttonType="primary"
          showPageHeaderRight={true}
        />
        <Grid item xs={12}>
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              data={this.props.list || []}
              columns={columns}
              options={{ ...tableOptions, onRowsDelete: data => this.rowDelete(data) }}
            />
          </MuiThemeProvider>
        </Grid>


      </main>
    )
  }

}

Party.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToPropos = state => ({ list: state.party.list });

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getList, deleteParty }, dispatch);

Party = connect(mapStateToPropos, mapDispatchToProps)(Party)

const Comp = withStyles(styles)(Party)
export default
  React.forwardRef((props, ref) => <Comp {...props} forwardedRef={ref} />);