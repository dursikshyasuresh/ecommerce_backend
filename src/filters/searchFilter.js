/**
 * Reusable search filter for mongoose queries.
 *
 * @param {string} search - keyword to search for (usually req.query.search)
 * @param {string[]} fields - model fields to search in
 * @returns {object} mongoose filter object
 *
 * @example
 * const filter = SearchFilter(req.query.search, ["title","description"])
 * const products = await Product.find(filter)
 */

const SearchFilter = (search, fields = []) => {
  // no keyword or no fields -> empty filter (returns all documents)
  if (!search || !fields.length) return {};

  // escape special regex characters so user input is matched literally   
  const keyword = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return {
    // match if ANY of the fields contains the keyword
    $or: fields.map((field) => ({
      // partial match, "i" = case-insensitive
      [field]: { $regex: keyword, $options: "i" },
    })),
  };
};

export default SearchFilter;
