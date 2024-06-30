import { darken, lighten, styled } from '@mui/material/styles';
import { DataGridProps, DataGrid as MuiDataGrid } from '@mui/x-data-grid';

const extraColorCoefficient = 0.2;

const getBackgroundColor = (color: string, mode: string) =>
    mode === 'dark'
        ? darken(color, 0.7 + extraColorCoefficient)
        : lighten(color, 0.7 + extraColorCoefficient);

const getHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark'
        ? darken(color, 0.6 + extraColorCoefficient)
        : lighten(color, 0.6 + extraColorCoefficient);

const getSelectedBackgroundColor = (color: string, mode: string) =>
    mode === 'dark'
        ? darken(color, 0.5 + extraColorCoefficient)
        : lighten(color, 0.5 + extraColorCoefficient);

const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark'
        ? darken(color, 0.4 + extraColorCoefficient)
        : lighten(color, 0.4 + extraColorCoefficient);

const StyledDataGrid = styled(MuiDataGrid)(({ theme }) => ({
    '& .row-status--Normal': {
        backgroundColor: theme.palette.background.default,
        '&:hover': {
            backgroundColor:
                theme.palette.mode === 'dark'
                    ? theme.palette.grey['900']
                    : theme.palette.grey['200'],
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.background.default,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.background.paper,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .row-status--Current': {
        color: theme.palette.primary.main,
        fontWeight: 500,
        '&:hover': {
            backgroundColor: theme.palette.grey['200'],
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.background.default,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.background.paper,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .row-status--Vacancy': {
        backgroundColor: getBackgroundColor(theme.palette.success.main, theme.palette.mode),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode,
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.success.main,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .row-status--Dismissed': {
        backgroundColor: getBackgroundColor(theme.palette.warning.main, theme.palette.mode),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.warning.main,
                theme.palette.mode,
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.warning.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.warning.main,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .row-status--Deleted': {
        textDecoration: 'line-through',
        color: theme.palette.grey['600'],
        backgroundColor: theme.palette.background.default,
        '&:hover': {
            backgroundColor:
                theme.palette.mode === 'dark'
                    ? theme.palette.grey['900']
                    : theme.palette.grey['200'],
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.background.default,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.background.paper,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .row-status--Open': {
        backgroundColor: getBackgroundColor(theme.palette.info.main, theme.palette.mode),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(theme.palette.info.main, theme.palette.mode),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.info.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.info.main,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .row-status--Filled': {
        backgroundColor: getBackgroundColor(theme.palette.success.main, theme.palette.mode),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode,
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.success.main,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .row-status--PartiallyFilled': {
        backgroundColor: getBackgroundColor(theme.palette.warning.main, theme.palette.mode),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.warning.main,
                theme.palette.mode,
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.warning.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.warning.main,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .row-status--Rejected': {
        backgroundColor: getBackgroundColor(theme.palette.error.main, theme.palette.mode),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(theme.palette.error.main, theme.palette.mode),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.error.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.error.main,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .row-status--Todo': {
        backgroundColor: getBackgroundColor(theme.palette.warning.main, theme.palette.mode),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.warning.main,
                theme.palette.mode,
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.warning.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.warning.main,
                    theme.palette.mode,
                ),
            },
        },
    },
    '& .row-status--Overdue': {
        backgroundColor: getBackgroundColor(theme.palette.error.main, theme.palette.mode),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(theme.palette.error.main, theme.palette.mode),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.error.main,
                theme.palette.mode,
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.error.main,
                    theme.palette.mode,
                ),
            },
        },
    },
}));

type Props = DataGridProps & {
    getRowStatus?: (params: any) => string;
};

export function DataGrid(props: Props) {
    const { getRowStatus, ...other } = props;
    return (
        <StyledDataGrid //MuiDataGrid
            rowSelection={true}
            // slots={{ toolbar: GridToolbar }}
            // slotProps={{ toolbar: { csvOptions } }}
            // slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
            autoPageSize={true}
            density={'standard'}
            editMode={'row'}
            ignoreDiacritics={true}
            showCellVerticalBorder={true}
            disableRowSelectionOnClick={true}
            rowHeight={40}
            columnHeaderHeight={40}
            // pagination={true}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                },
            }}
            pageSizeOptions={[5, 10, 50]}
            sx={{
                // boxShadow: 2,
                border: 1,
                borderColor: 'divider',
                minHeight: 240,
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'background.paper',
                    borderColor: 'divider',
                    fontSize: '1rem',
                },
                '& .MuiDataGrid-footerContainer': {
                    backgroundColor: 'background.paper',
                    borderColor: 'divider',
                    height: 40,
                    minHeight: 40,
                },
                // '& .MuiDataGrid-row': {
                //     // border: 0.5,
                //     // borderColor: 'divider',
                // },
                '& .MuiDataGrid-cell': {
                    fontSize: '1rem',
                    borderColor: 'divider',
                },

                // '& .MuiDataGrid-row:hover': {
                //     backgroundColor: 'background.paper',
                // },
            }}
            {...other}
            getRowClassName={(params) => {
                const status = getRowStatus ? getRowStatus(params) : 'Normal';
                return `row-status--${status}`;
            }}
        />
    );
}
