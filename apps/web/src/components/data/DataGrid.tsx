import { DataGridProps } from '@mui/x-data-grid';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';

export function DataGrid(props: DataGridProps) {
    return (
        <MuiDataGrid
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
                // borderRadius: '2px',
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'background.paper',
                    borderColor: 'divider',
                    fontSize: '1rem',
                },
                '& .MuiDataGrid-footerContainer': {
                    backgroundColor: 'background.paper',
                    borderColor: 'divider',
                    // fontSize: '1rem',
                },
                '& .MuiDataGrid-row': {
                    // border: 0.5,
                    // borderColor: 'divider',
                },
                '& .MuiDataGrid-cell': {
                    // backgroundColor: 'rgba(255, 7, 0, 0.55)',
                    fontSize: '1rem',
                },

                '& .MuiDataGrid-row:hover': {
                    // color: 'primary.main',
                    backgroundColor: 'background.paper',
                },
            }}
            {...props}
        />
    );
}
