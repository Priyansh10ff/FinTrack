import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

// A simple search bar with a magnifying glass icon
function SearchBar({ value, onChange, placeholder = 'Search transactions...' }) {
  return (
    <div className="search-input-wrap">
      <HiOutlineMagnifyingGlass className="search-icon" />
      <input
        id="search-transactions"
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
