import axios from "axios";
import {differenceInDays} from "date-fns";
const WHO_IS_API = 'https://api.whois7.ru/?q=';

export const getBackNameByTime = (name: string): string => {
    const currentDate = new Date();
    return `${name}-${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
    }-${currentDate.getDate()}-${currentDate.getHours()}${currentDate.getMinutes()}`
}

export const getExpiredDate = async (domainName: string): Promise<Date | null> => {
    const { data } = await axios.get(`${WHO_IS_API}${domainName}`);
    const expiredAt = data?.expires;
    return expiredAt ? new Date(expiredAt * 1000) : null;
}


export const getDifferenceDays = (date) => {
    return differenceInDays(
        new Date(date),
        new Date()
    )
}
