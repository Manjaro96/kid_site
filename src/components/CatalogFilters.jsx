export default function CatalogFilters({ collections, filters, rarityOptions, onChange }) {
  return (
    <div className="catalog-toolbar">
      <label className="filter-field">
        <span>Set</span>
        <select
          value={filters.collectionHandle}
          onChange={(event) => onChange({ collectionHandle: event.target.value })}
        >
          <option value="">All sets</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.handle}>
              {collection.title}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Rarity</span>
        <select value={filters.rarity} onChange={(event) => onChange({ rarity: event.target.value })}>
          <option value="">All rarities</option>
          {rarityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Stock</span>
        <select
          value={filters.availability}
          onChange={(event) => onChange({ availability: event.target.value })}
        >
          <option value="all">All</option>
          <option value="in-stock">In stock</option>
        </select>
      </label>

      <label className="filter-field">
        <span>Min price</span>
        <input
          type="number"
          min="0"
          inputMode="decimal"
          value={filters.minPrice}
          onChange={(event) => onChange({ minPrice: event.target.value })}
          placeholder="0"
        />
      </label>

      <label className="filter-field">
        <span>Max price</span>
        <input
          type="number"
          min="0"
          inputMode="decimal"
          value={filters.maxPrice}
          onChange={(event) => onChange({ maxPrice: event.target.value })}
          placeholder="500"
        />
      </label>
    </div>
  );
}
