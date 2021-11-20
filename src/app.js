import 'bootstrap';

import './app.scss';
import './js/plot.js';
import './js/service.js';

import { GoogleCharts } from "google-charts";
import { initChart, initRSIPlot, initMACDPlot } from './js/plot.js';


//Load the charts library with a callback
GoogleCharts.load(() => {
  initChart();
  initRSIPlot();
  initMACDPlot();

  $(window).on("resize", function(){
    initChart();
    initRSIPlot();
    initMACDPlot();
  });

});


