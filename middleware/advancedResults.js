const advancedResults = (model, populate) => async (req,res, next) => {
    let query;
    
    // Copy req.query, if any
    const reqQuery = { ...req.query };

    // Query fields to exclude from reqQuery
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Remove fields from reqQuery
    removeFields.forEach(field => delete reqQuery[field]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // format into str for mongoDB op (ie. prepend with '$')
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // console.log(queryStr);

    // Find query in db
    query = model.find(JSON.parse(queryStr));

    // Handle select field queries (NOTE: select queries delimited by ',' with no whitespace. eg. ?select=name,description)
    if (req.query.select) {
        // split string value in select key into array delimited by ',' then join array back into single string delimited by whitespace
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Handle sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else { 
        // Default sort by createdAt date (in descending order, most recent first)
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    
    // start and end entry number for a page
    const startIndex = (page - 1) * limit; 
    const endIndex = page * limit;

    const totalEntries = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populate each model with corresponsing populate model (using virtuals, see Bootcamp model)
    if (populate) {
        query = query.populate(populate);
    }

    const results = await query;

    // Pagination results
    const pagination = {};

    if (endIndex < totalEntries) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev ={
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
};

module.exports = advancedResults;
