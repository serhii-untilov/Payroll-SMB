import {
    BusinessCenterOutlined,
    CalculateOutlined,
    CreditScore,
    Equalizer,
    LandscapeOutlined,
    PeopleOutlined,
    Schedule,
} from '@mui/icons-material';
import { List } from '@mui/material';
import { ListItemButton } from '../data/ListItemButton';
import { ListItemLink } from '../data/ListItemLink';

export function MainMenu() {
    const onCompanyClick = () => {
        // Make menu:
        // Company details
        // -- Select company --
        // <Company List>
        // -- Divider --
        // New Company
    };

    return (
        <List component="nav" sx={{ mx: ['auto'] }}>
            <ListItemButton
                onClick={onCompanyClick}
                primary="Company"
                icon={<BusinessCenterOutlined />}
            />
            <ListItemLink to="/employees" primary="Employees" icon={<PeopleOutlined />} />
            {/* <ListItemLink to="/time-off" primary="Time Off" icon={<LandscapeOutlined />} /> */}
            <ListItemLink to="/timesheet" primary="Time Sheet" icon={<Schedule />} />
            <ListItemLink to="/payroll" primary="Payroll" icon={<CalculateOutlined />} />
            <ListItemLink to="/payments" primary="Payments" icon={<CreditScore />} />
            {/* <ListItemLink to="/pay-contractors" primary="Pay Contractors" icon={<Description />} /> */}
            {/* <ListItemLink to="/benefits" primary="Benefits" icon={<Description />} /> */}
            {/* <ListItemLink to="/compliant" primary="Stay Compliant" icon={<Description />} /> */}
            {/* <ListItemLink to="/surveys" primary="Surveys" icon={<Description />} /> */}
            <ListItemLink to="/reports" primary="Reports" icon={<Equalizer />} />
            {/* <ListItemLink to="/reports" primary="Settings" icon={<Settings />} /> */}
        </List>
    );
}
