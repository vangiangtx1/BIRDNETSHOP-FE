import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Pagination as MuiPagination, PaginationItem } from '@mui/material';

const Pagination = ({ refix, size }) => {
    const param = useLocation();
    const query = new URLSearchParams(param.search);
    const page = parseInt(query.get('page') || '1', 10);

    return (
        <MuiPagination
            page={page}
            count={size}
            renderItem={(item) => (
                <PaginationItem
                    component={Link}
                    to={`/${refix}${item.page === 1 ? '' : `?page=${item.page}`}`}
                    {...item}
                />
            )}
        />
    );
};

export default Pagination;