const Filters = () => {
  // Filters can become drawer for small devices
  // Filters the array of results. Filter parameter is used when a customer applies a filter in the UI.
  // Parameter names should be "filter.[field]", value is case sensitive.
  // Examples:
  // * filter.color=blue
  // * filter.size=Large
  // If a filter is configured to have a type of slider or if a range is specified in the advanced section, in order to use the range functionality a low and/or high value will need to be chained after the field.
  // Examples:
  // * filter.price.low=2
  // * filter.price.high=120
  return <div>Filters</div>;
};

export default Filters;
