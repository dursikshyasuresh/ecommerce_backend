const createPagination = (page,limit,totalItems) => {
     const currentPage = Number(page) || 1
     const perPage = Number(limit) || 10
     const skip = (currentPage - 1) * perPage
     const totalPages = Math.ceil(totalItems / perPage)
     const hasNextPage = (currentPage * perPage) < totalItems
     const hasPrevPage = currentPage > 1

     return{
        total: totalItems,
        limit: perPage,
        skip,
        totalPages,
        hasNextPage,
        hasPrevPage
     }
}

export default createPagination

