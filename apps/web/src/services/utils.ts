export function rgb(r: number, g: number, b: number): string {
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}

// React Hook Forms
// Get only the dirty field values
// Modified: https://github.com/orgs/react-hook-form/discussions/1991#discussioncomment-6318535
export function getDirtyValues<
    DirtyFields extends Record<string, unknown>,
    // Values extends Record<keyof DirtyFields, unknown>,
    Values extends Partial<Record<keyof DirtyFields, unknown>>,
>(dirtyFields: DirtyFields, values: Values): Partial<typeof values> {
    const dirtyValues = Object.keys(dirtyFields).reduce((prev, key) => {
        // Unsure when RFH sets this to `false`, but omit the field if so.
        if (!dirtyFields[key]) return prev;

        return {
            ...prev,
            [key]:
                typeof dirtyFields[key] === 'object'
                    ? getDirtyValues(dirtyFields[key] as DirtyFields, values[key] as Values)
                    : values[key],
        };
    }, {});

    return dirtyValues;
}
