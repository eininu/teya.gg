export const HAZARD_URL = "https://hazard.mf.gov.pl/BlockedRegisterPositions?pageIndex=1&pageSize=15&DomainAddress="

export const HAZARD_PARAMS: RequestInit = {
    "headers": {
        "accept": "*/*",
        "accept-language": "ru,en;q=0.9,ro;q=0.8,bg;q=0.7,en-US;q=0.6,ru-RU;q=0.5",
        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "cookie": "ARRAffinity=97397c6b264df1ce7044749fe97d8a273ee9a34843c1fab8a3c81c0a6a7c8dec; ARRAffinitySameSite=97397c6b264df1ce7044749fe97d8a273ee9a34843c1fab8a3c81c0a6a7c8dec",
        "Referer": "https://hazard.mf.gov.pl/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
}