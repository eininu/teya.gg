export const getBackNameByTime = (name: string): string => {
    const currentDate = new Date();
    return `${name}-${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
    }-${currentDate.getDate()}-${currentDate.getHours()}${currentDate.getMinutes()}`
}