export function getObjectByType<Type>(data: any): Type {
    const template: Type = data as Type;
    return template;
}
