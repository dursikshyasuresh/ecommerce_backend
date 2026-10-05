import slugify from "slugify"

const generateSlug = (slug) => slugify(
    slug,
    {lower:true, strict:true, trim: true}
)

export default generateSlug