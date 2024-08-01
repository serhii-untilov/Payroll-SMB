import { Box } from '@mui/material';
import { FeaturesRoleCard } from './FeaturesRoleCard';
import { useFeatures } from '../hooks/Features.hooks';

const FeaturesRoleList = () => {
    const { featuresByRoles, selectedIndex, setSelectedIndex } = useFeatures();

    return (
        <Box id="features-by-roles" sx={{ display: 'flex', gap: 2 }}>
            <Box
                id="features-by-roles__left-side"
                sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 4 }}
            >
                {featuresByRoles.map((item, index) => (
                    <FeaturesRoleCard
                        key={index}
                        name={item.name}
                        description={item.description}
                        icon={item.icon}
                        selectedIndex={selectedIndex}
                        index={index}
                        onClick={(index) => setSelectedIndex(index)}
                        details={item.details}
                    ></FeaturesRoleCard>
                ))}
            </Box>
            <Box
                id="features-by-roles__right-side"
                sx={{
                    flex: 5,
                    display: { xs: 'none', sm: 'none', md: 'flex' },
                    flexDirection: 'column',
                    height: '100%',
                    borderRadius: 3,
                    p: 2,
                    // From https://css.glass
                    bgcolor: (theme) =>
                        theme.palette.mode === 'dark' ? '' : 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    webkitBackdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    minHeight: 380,
                    overflow: 'auto',
                }}
            >
                {featuresByRoles[selectedIndex].roleFeatures}
            </Box>
        </Box>
    );
};

export default FeaturesRoleList;
