import { Container, Typography } from '@material-ui/core';
import { sortBy } from 'lodash';
import moment from 'moment';
import 'moment/locale/vi';
import { useEffect, useState } from 'react';
import { getCountries, getReportByCountry } from './apis';
import CountrySelector from './components/CountrySelector';
import Highlight from './components/Highlight';
import Summary from './components/Summary';
import '@fontsource/roboto';

moment.locale('vi');

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [report, setReport] = useState([]);

  useEffect(() => {
    getCountries().then((res) => {
      const countries = sortBy(res.data, 'Country');
      setCountries(countries);
      setSelectedCountryId('vn');
    });
  }, []);

  const handleOnChange = (e) => {
    setSelectedCountryId(e.target.value);
  };

  useEffect(() => {
    if (selectedCountryId) {
      const { Slug } = countries.find(
        (country) => country.ISO2.toLowerCase() === selectedCountryId
      );

      //Call API
      getReportByCountry(Slug).then((res) => {
        res.data.pop();
        setReport(res.data);
      });
    }
  }, [countries, selectedCountryId]);

  return (
    <Container style={{ marginTop: 20 }}>
      <Typography variant='h2' component='h2'>
        Số liệu COVID-19
      </Typography>
      <Typography>{moment().format('LLL')}</Typography>
      <CountrySelector
        handleOnChange={handleOnChange}
        countries={countries}
        value={selectedCountryId}
      />
      <Highlight report={report} />
      <Summary report={report} />
    </Container>
  );
}

export default App;
