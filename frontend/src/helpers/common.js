import punycode from "punycode";

export const convertedDomainNames = (data) => {
    return data.map((website) => ({
        ...website,
        domainName: punycode.toUnicode(website.domainName),
    }));
}