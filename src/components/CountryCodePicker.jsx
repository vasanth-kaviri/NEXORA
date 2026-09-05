/**
 * CountryCodePicker
 *
 * A reusable phone-input prefix component: renders a flag+code button that
 * opens a searchable dropdown of country dial codes.
 *
 * Designed to pair with a tel <input> in a flex row.
 *
 * Props:
 *  - countryCode         (string)   currently selected dial code e.g. '+91'
 *  - setCountryCode      (fn)       setter
 *  - showCountryMenu     (boolean)  whether the dropdown is open
 *  - setShowCountryMenu  (fn)       setter
 *  - searchCountry       (string)   current search query
 *  - setSearchCountry    (fn)       setter
 *  - filteredCountries   (array)    pre-filtered list from useCountryCodes
 *  - countryCodes        (array)    full list (used to find current flag)
 *  - error               (boolean)  optional; highlights border in error state
 */
export default function CountryCodePicker({
  countryCode,
  setCountryCode,
  showCountryMenu,
  setShowCountryMenu,
  searchCountry,
  setSearchCountry,
  filteredCountries,
  countryCodes,
  error = false,
}) {
  const selectedCountry = countryCodes.find((c) => c.code === countryCode);

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Trigger button */}
      <button
        type="button"
        className="input-field flex items-center justify-between tactile-press"
        style={{
          width: '100px',
          paddingLeft: '12px',
          paddingRight: '12px',
          borderColor: error ? 'var(--secondary)' : '',
        }}
        onClick={() => setShowCountryMenu(!showCountryMenu)}
      >
        <span>
          {selectedCountry?.flag} {countryCode}
        </span>
      </button>

      {/* Dropdown */}
      {showCountryMenu && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '220px',
            zIndex: 10,
            marginTop: '4px',
            padding: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          <input
            type="text"
            placeholder="Search country..."
            className="input-field mb-xs"
            style={{ width: '100%', padding: '6px 12px', fontSize: '0.85rem' }}
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex flex-col gap-xs">
            {filteredCountries.map((c, i) => (
              <div
                key={i}
                className="interactive cursor-pointer"
                style={{
                  padding: '6px 8px',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                }}
                onClick={() => {
                  setCountryCode(c.code);
                  setShowCountryMenu(false);
                  setSearchCountry('');
                }}
              >
                <span>
                  {c.flag} {c.name}
                </span>
                <span className="text-muted">{c.code}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
