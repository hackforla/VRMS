import React, {useState} from 'react';
import Loading from '../donutChartLoading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../common/datepicker/index.scss';
import './index.scss';

const LocationTableReport = ({eventTypeStats, hackNightTypeStats, handleFilteredData, processedEvents}) => {
    const headerGroups = ['Location', 'Volunteers', 'Hours', 'Avg Hours'];
    let isLoading = true;
    let dataForAllEventsReport = [];
    let dataForHackNightReport = [];
    let eventTypes = [];
    let hackNightTypes = [];
    let totalForAllEvents = [];
    let totalForHackNight = [];
    let sortedEventsByDate = [];
    let isStatsByLocation = true;
    let isStatsByHackNight = true;

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isDatepicker, showDatepicker] = useState(false);
    const [isFilterButton, showFilterButton] = useState(true);
    const [isFiltered, setFilterState] = useState(false);
    const [startTextDate, setStartTextDate] = useState(new Date().toLocaleDateString("en-US"));
    const [endTextDate, setEndTextDate] = useState(new Date().toLocaleDateString("en-US"));

    prepareDataForReport(
        eventTypeStats,
        eventTypes,
        dataForAllEventsReport
    );

    prepareDataForReport(
        hackNightTypeStats,
        hackNightTypes,
        dataForHackNightReport
    );

    sortEventsByDate(processedEvents);

    function prepareDataForReport(data, types, dataForReport) {
        if (types.length === 0) {
            for (const [key] of Object.entries(data[0])) {
                types.push(key);
            }
        }
        setLocation(data, dataForReport);
        setStatsByLocation(data, dataForReport, types);
        calculateTotalResults(data, types);
    }

    function setLocation(data, dataForReport) {
        for (const [key] of Object.entries(data[0])) {
            let newStat = {};
            newStat.location = key;
            newStat.id = Math.floor(Math.random() * 100);
            dataForReport.push(newStat);
        }
    }

    function setStatsByLocation(data, dataForReport, types) {
        data.forEach((obj, statIndex) => {
            types.forEach((location, locationIndex) => {
                if (statIndex === 0) {
                    dataForReport[locationIndex].totalVolunteers = obj[location];
                }

                if (statIndex === 1) {
                    dataForReport[locationIndex].totalVolunteerHours = obj[location];
                }

                if (statIndex === 2) {
                    dataForReport[locationIndex].totalVolunteerAvgHours = obj[location];
                }
            })
        })
    }

    function calculateTotalResults(data, types) {
        for (let i = 0; i < data.length; i++) {
           let total = 0;
           for (const [_, value] of Object.entries(data[i])) {
               const res = total + value;
               total = Math.round(100 * res) / 100;
           }
           if (types === eventTypes) {
               totalForAllEvents.push(total);
           }

           if (types === eventTypes) {
               totalForHackNight.push(total);
           }
       }
        displayStats();
    }

    function displayStats() {
        isStatsByLocation = (Math.max(...totalForAllEvents) !== 0);
        isStatsByHackNight = (Math.max(...totalForHackNight) !== 0);
        if (dataForAllEventsReport.length > 0 && dataForHackNightReport.length > 0) isLoading = false;
    }

    function handleSetFilterBtn() {
        showDatepicker(!isDatepicker);
        showFilterButton(!isFilterButton);
    }

    function handleChangeStartDate(date) {
        let newDate = new Date(date).toLocaleDateString("en-US");
        setStartDate(date);
        setStartTextDate(newDate);
    }

    function handleChangeEndDate(date) {
        let newDate = new Date(date).toLocaleDateString("en-US");
        setEndDate(date);
        setEndTextDate(newDate);
    }

    function handleCalculateStatsBtn() {
        isLoading = true;
        showDatepicker(!isDatepicker);
        showFilterButton(!isFilterButton);
        setFilterState(true);
        extractEventsByCustomTimePeriod();
    }

    function sortEventsByDate(processedEvents) {
        //The array is sorted from earliest to oldest events (Jan 2020)
        sortedEventsByDate = processedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    function extractEventsByCustomTimePeriod() {
        dataForAllEventsReport = [];
        dataForHackNightReport = [];
        totalForAllEvents = [];
        totalForHackNight = [];
        const filteredEvents = [];
        sortedEventsByDate.forEach(event => {
            const date = new Date(event.date);
            if (date.getTime() >= new Date(startDate).getTime() && date.getTime() <= new Date(endDate.getTime())) {
                filteredEvents.push(event);
            }
        })
        setStartDate(new Date());
        setEndDate(new Date());
        handleFilteredData(filteredEvents);
    }

    return (
        <div className="table-report-wrap">
            {!isLoading ? (
                <div className="admin-table-report">
                    {isFilterButton ? (
                        <button
                            className="filter-button"
                            type="button"
                            onClick={() => handleSetFilterBtn()}
                        >
                            Set Filter
                        </button>
                    ) : null }

           {isDatepicker ? (
               <div className="datepicker-section">
                   <div className="datepicker-wrap">
                       <p className="datepicker-name">Start</p>
                       <DatePicker
                           placeholderText='Start date range'
                           selected={startDate}
                           onChange={date => handleChangeStartDate(date)}
                           selectsStart
                           startDate={startDate}
                           endDate={endDate}
                           maxDate={endDate}
                       />
                   </div>

                   <div className="datepicker-wrap">
                       <p className="datepicker-name">End</p>
                       <DatePicker
                           placeholderText='End data range'
                           selected={endDate}
                           onChange={date => handleChangeEndDate(date)}
                           selectsEnd
                           startDate={startDate}
                           endDate={endDate}
                           maxDate={new Date()}
                       />
                   </div>

                   <button
                       className="filter-button"
                       type="button"
                       onClick={(event) => handleCalculateStatsBtn(event)}
                   >
                       Calculate Stats
                   </button>
               </div>
           ) : null }

           <div className="stats-section">
               <div className="time-description">
                   <span>Stats calculated by: </span>
                   {!isFiltered ? (
                       <span>all time</span>
                   ) : (
                       <span>
                           <span>{startTextDate}</span>
                           <span> - </span>
                           <span>{endTextDate}</span>
                       </span>
                   )}
               </div>

               <div className="table-header m-t-small">All Events By Event Type</div>
               {isStatsByLocation ? (
                   <table className="admin-table">
                       <thead>
                       <tr>
                           {headerGroups.map(header => (
                               <th key={header}>{header}</th>
                           ))}
                       </tr>
                       </thead>

                       <tbody>
                       {dataForAllEventsReport.map((event) => (
                           <tr key={`events-${event.location}`}>
                               <td key={`${event.location + event.id}`}>{event.location}</td>
                               <td key={`v-${event.totalVolunteers + event.id}`}>{event.totalVolunteers}</td>
                               <td key={`h-${event.totalVolunteerHours + event.id}`}>{event.totalVolunteerHours}</td>
                               <td key={`ha-${event.totalVolunteerAvgHours + event.id}`}>{event.totalVolunteerAvgHours}</td>
                           </tr>
                       ))}

                       {totalForAllEvents ? (
                           <tr>
                               <td key={`events-total`}>Total</td>
                               {totalForAllEvents.map((total, i) => (
                                   <td key={`${headerGroups[i]}-events-total`}>{total}</td>
                               ))}
                           </tr>
                       ) : null }
                       </tbody>
                   </table>
               ) : (
                   <div>No data for calculation stats</div>
               )}


               <div className="table-header">HackNight Only</div>
               {isStatsByHackNight ? (
                   <table className="admin-table">
                       <thead>
                       <tr>
                           {headerGroups.map(header => (
                               <th key={header}>{header}</th>
                           ))}
                       </tr>
                       </thead>

                       <tbody>
                       {isStatsByHackNight && dataForHackNightReport.map((event) => (
                           <tr key={`hack-night-${event.location}`}>
                               <td key={`${event.location + event.id}`}>{event.location}</td>
                               <td key={`tv-${event.totalVolunteers + event.id}`}>{event.totalVolunteers}</td>
                               <td key={`th-${event.totalVolunteerHours + event.id}`}>{event.totalVolunteerHours}</td>
                               <td key={`ah-${event.totalVolunteerAvgHours + event.id}`}>{event.totalVolunteerAvgHours}</td>
                           </tr>
                       ))}

                       {totalForHackNight ? (
                           <tr>
                               <td key={`hack-night-total`}>Total</td>
                               {totalForHackNight.map((total, i) => (
                                   <td key={`${headerGroups[i]}-hack-total`}>{total}</td>
                               ))}
                           </tr>
                       ) : null }
                       </tbody>
                   </table>
               ) : (
                   <div>No data for calculation stats</div>
               )}
           </div>
       </div>
    ) : <Loading /> }
    </div>
    );
};

export default LocationTableReport;
