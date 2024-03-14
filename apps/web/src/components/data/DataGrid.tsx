import { DataGridProps } from '@mui/x-data-grid';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';

export function DataGrid(props: DataGridProps) {
    return (
        <MuiDataGrid
            autoPageSize={true}
            rowSelection={true}
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
                '& .MuiDataGrid-row': {
                    // border: 0.5,
                    // borderColor: 'divider',
                },
                '& .MuiDataGrid-cell': {
                    fontSize: '1rem',
                    borderColor: 'divider',
                },

                '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'background.paper',
                },
            }}
            {...props}
        />
    );
}
