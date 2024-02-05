export type ImportJsonDto = {
    website: string;
    links: Link[] | []
}

type Link = {
    url: string;
    text: string;
}



