import AppContext from '@/context/AppContext';
import { useContext } from 'react';

const useAppContext = () => useContext(AppContext);

export default useAppContext;
