import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';

/**
 * useMounted returns when a component mounted.
 * You can track lifecyle of any component.
 * Somehow if you need to know that a component is mounted or not, you can get it easily.
 * const mounted = useMounted();
 * if (mounted.current) {
 *      component mounted
 *      mounted.current - refers to component
 * }
 */
const useMounted = (): MutableRefObject<boolean> => {
    const isMounted = useRef(true);

    useEffect(
        () => (): void => {
            isMounted.current = false;
        },
        [],
    );

    return isMounted;
};

export default useMounted;
