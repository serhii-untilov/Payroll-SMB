import { SelectPersonOption } from '../types/SelectPersonOption';

export function getOptionLabel(option: SelectPersonOption) {
    // Value selected with enter, right from the input
    if (typeof option === 'string') {
        return option;
    }
    // Add "xxx" option created dynamically
    if (option.inputValue) {
        return option.inputValue;
    }
    // Regular option
    return option.label || '';
}
