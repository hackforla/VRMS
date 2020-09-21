import React, { useState } from 'react';
import Loading from '../donutChartLoading';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../common/datepicker/index.scss';
import './index.scss';

const LocationTableReport = ({eventTypeStats, hackNightTypeStats, processedData}) => {
    const headerGroups = ['Location', 'Volunteers', 'Hours', 'Avg Hours'];
    let dataForAllEventsReport = [];
    let dataForHackNightReport = [];
    let eventTypes = [];
    let hackNightTypes = [];
    let totalForAllEvents = [];
    let totalForHackNight = [];
    let isLoading = true;

    // Datepicker
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isDatepicker, showDatepicker] = useState(false);

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

    function prepareDataForReport(data, types, dataForReport) {
        for (const [key] of Object.entries(data[0])) {
            let newStat = {};
            newStat.location = key;
            types.push(key);
            dataForReport.push(newStat);
        }

        data.forEach((obj, statIndex) => {
            types.forEach((location, locationIndex) => {
                if(statIndex === 0) dataForReport[locationIndex].totalVolunteers = obj[location];
                if(statIndex === 1) dataForReport[locationIndex].totalVolunteerHours = obj[location];
                if(statIndex === 2) dataForReport[locationIndex].totalVolunteerAvgHours = obj[location];
            })
        })
        calculateTotalResults(data, types);
    }

    function calculateTotalResults(data, types) {
       for (let i = 0; i < data.length; i++) {
           let total = 0;
           for (const [key, value] of Object.entries(data[i])) {
               const res = total + value;
               total = Math.round(100 * res) / 100;
           }
           types === eventTypes ? totalForAllEvents.push(total) : totalForHackNight.push(total);
       }
       displayStats();
    }

    function displayStats() {
        if(dataForAllEventsReport.length > 0 && dataForHackNightReport.length > 0) isLoading = false;
    }

    function handleClick() {
        isDatepicker ? showDatepicker(false) : showDatepicker(true);
    }

    function handleChangeStartDate (date) {
        setStartDate(date);
    }

    return (
        <div className="table-report-wrap">
            {!isLoading ? (
                <div className="admin-table-report">
                    <button
                        className="filter-button"
                        type="button"
                        onClick={() => handleClick()}
                    >
                        Set Filter
                    </button>

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
                                />
                            </div>

                            <div className="datepicker-wrap">
                                <p className="datepicker-name">End</p>
                                <DatePicker
                                    placeholderText='End data range'
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                />
                            </div>
                        </div>
                    ) : null }

                    <div className="stats-section">
                        <div className="table-header">All Events By Event Type</div>
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
                                    <td key={event.location}>{event.location}</td>
                                    <td key={event.totalVolunteers}>{event.totalVolunteers}</td>
                                    <td key={event.totalVolunteerHours}>{event.totalVolunteerHours}</td>
                                    <td key={event.totalVolunteerAvgHours}>{event.totalVolunteerAvgHours}</td>
                                </tr>
                            ))}

                            {totalForAllEvents.length > 0 ? (
                                <tr>
                                    <td key={`events-total`}>Total</td>
                                    {totalForAllEvents.map((total, i) => (
                                        <td key={`${headerGroups[i]}-events-total`}>{total}</td>
                                    ))}
                                </tr>
                            ) : null }
                            </tbody>
                        </table>

                        <div className="table-header">HackNight Only</div>
                        <table className="admin-table">
                            <thead>
                            <tr>
                                {headerGroups.map(header => (
                                    <th key={header}>{header}</th>
                                ))}
                            </tr>
                            </thead>

                            <tbody>
                            {dataForHackNightReport.map((event) => (
                                <tr key={`hack-night-${event.location}`}>
                                    <td key={event.location}>{event.location}</td>
                                    <td key={event.totalVolunteers}>{event.totalVolunteers}</td>
                                    <td key={event.totalVolunteerHours}>{event.totalVolunteerHours}</td>
                                    <td key={event.totalVolunteerAvgHours}>{event.totalVolunteerAvgHours}</td>
                                </tr>
                            ))}

                            {totalForHackNight.length > 0 ? (
                                <tr>
                                    <td key={`hack-night-total`}>Total</td>
                                    {totalForHackNight.map((total, i) => (
                                        <td key={`${headerGroups[i]}-hack-total`}>{total}</td>
                                    ))}
                                </tr>
                            ) : null }
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : <Loading /> }
        </div>
    );
}

export default LocationTableReport;
