class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => {
      return delete queryObj[el];
    });
    let value = Object.values(queryObj).flat(1);

    if (value.length === 0) {
      this.query = this.query.find();
      return this;
    }
    if (value[0].length === 0) {
      this.query = this.query.find(queryObj);
      return this;
    }
    if (value.length !== 0) {
      value = value
        .map(el => {
          return el.split(',');
        })
        .flat(1);

      this.query = this.query.find({ category: { $in: value } });
      return this;
    } else {
      this.query = this.query.find(queryObj);
      return this;
    }
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
