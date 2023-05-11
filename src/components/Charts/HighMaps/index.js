import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from 'highcharts/modules/map';
import { cloneDeep } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

// load highcharts modules
highchartsMap(Highcharts);

const initOptions = {
  chart: {
    height: '500',
  },
  title: {
    text: null,
  },
  mapNavigation: {
    enabled: true,
  },
  colorAxis: {
    min: 0,
    stops: [
      [0.2, '#FFC4AA'],
      [0.4, '#FF8A66'],
      [0.6, '#FF392B'],
      [0.8, '#B71525'],
      [1, '	#7A0826'],
    ],
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'bottom',
  },
  series: [
    {
      name: 'Dân số',
      joinBy: ['hc-key', 'key'],
    },
  ],
};

const HighMaps = ({ mapData }) => {
  const [options, setOptions] = useState({});
  const chartRef = useRef(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    console.log({ mapData });
    if (mapData && Object.keys(mapData).length) {
      const fakeData = mapData.features.map((feature, index) => ({
        key: feature.properties['hc-key'],
        value: index,
      }));

      setOptions({
        ...initOptions,
        series: [
          {
            ...initOptions.series[0],
            mapData: mapData,
            data: fakeData,
          },
        ],
      });
      if (!configLoaded) setConfigLoaded(true);
    }
  }, [mapData, configLoaded]);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      chartRef.current.chart.series[0].update({
        mapData,
      });
    }
  });

  if (!configLoaded) return <p>abc</p>;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={cloneDeep(options)}
      constructorType={'mapChart'}
      ref={chartRef}
    />
  );
};

HighMaps.defaultProps = {
  mapData: {},
};

export default React.memo(HighMaps);
