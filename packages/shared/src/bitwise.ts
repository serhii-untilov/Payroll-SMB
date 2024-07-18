export function setBit(mask: number, bitIndex: number, value: boolean) {
    if (value) {
        return (mask |= 1 << bitIndex);
    }
    return (mask &= ~(1 << bitIndex));
}

export function getBit(mask: number, bitIndex: number) {
    return mask & (1 << bitIndex) ? true : false;
}

export function swapBit(mask: number, bitIndex: number) {
    return setBit(mask, bitIndex, !getBit(mask, bitIndex));
}
