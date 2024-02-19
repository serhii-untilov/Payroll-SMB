import { useContext } from 'react';
import LocaleContext from '../context/LocaleContext';

const useLocale = () => useContext(LocaleContext);

export default useLocale;
