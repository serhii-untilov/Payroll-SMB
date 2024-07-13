// React Hook Forms
// Get only the dirty field values
// Modified: https://github.com/orgs/react-hook-form/discussions/1991#discussioncomment-6318535
export function getDirtyValues<
    DirtyFields extends Record<string, any>,
    // Values extends Record<keyof DirtyFields, unknown>,
    Values extends Partial<Record<keyof DirtyFields, any>>,
>(dirtyFields: DirtyFields, values: Values, hasOwnPropertyCheck = false): Partial<typeof values> {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const dirtyValues = Object.keys(dirtyFields).reduce((prev, key) => {
        // Unsure when RFH sets this to `false`, but omit the field if so.
        if (!dirtyFields[key]) return prev;
        if (hasOwnPropertyCheck && !hasOwnProperty?.call(values, key)) return prev;

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
