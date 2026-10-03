import { useState, useMemo } from 'react';
import { COUNTRY_CODES } from '../utils/countries';

/**
 * Encapsulates country code picker state and filtering logic.
 * Used by CountryCodePicker and any form that needs phone input with a country selector.
 *
 * @returns {{
 *   countryCode: string,
 *   setCountryCode: Function,
 *   showCountryMenu: boolean,
 *   setShowCountryMenu: Function,
 *   searchCountry: string,
 *   setSearchCountry: Function,
 *   filteredCountries: Array,
 *   countryCodes: Array,
 * }}
 */
export function useCountryCodes(defaultCode = '+1') {
  const [countryCode, setCountryCode]       = useState(defaultCode);
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [searchCountry, setSearchCountry]   = useState('');

  const filteredCountries = useMemo(
    () =>
      COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
          c.code.includes(searchCountry)
      ),
    [searchCountry]
  );

  return {
    countryCode,
    setCountryCode,
    showCountryMenu,
    setShowCountryMenu,
    searchCountry,
    setSearchCountry,
    filteredCountries,
    countryCodes: COUNTRY_CODES,
  };
}
