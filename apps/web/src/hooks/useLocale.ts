import LocaleContext from '@/context/LocaleContext';
import { useContext } from 'react';

const useLocale = () => useContext(LocaleContext);

export { useLocale };
