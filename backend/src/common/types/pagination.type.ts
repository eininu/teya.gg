export type PaginationData<T> = {
    data: T[];
    total: number;
};

export type PaginationQuery = {
    limit: number;
    skip: number;
};
