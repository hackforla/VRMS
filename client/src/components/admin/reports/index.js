import React from 'react';
import Loading from '../donutChartLoading';

const LocationTableReport = ({eventTypeStats, hackNightTypeStats}) => {
    const headerGroups = ['Location', 'Volunteers', 'Hours', 'Avg Hours'];
    let dataForAllEventsReport = [];
    let dataForHackNightReport = [];
    let eventTypes = [];
    let hackNightTypes = [];
    let totalForAllEvents = [];
    let totalForHackNight = [];
    let isLoading = true;

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

    function prepareDataForReport (data, types, dataForReport) {
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

    function calculateTotalResults (data, types) {
       for (let i = 0; i < data.length; i++) {
           let total = 0;
           for (const [key, value] of Object.entries(data[i])) {
               total += Math.round(100 * value) / 100;
           }
           types === eventTypes ? totalForAllEvents.push(total) : totalForHackNight.push(total);
       }
       displayStats();
    }

    function displayStats () {
        if(dataForAllEventsReport.length > 0 && dataForHackNightReport.length > 0) isLoading = false;
    }

    return (
        <div className="table-report-wrap">
            {!isLoading ? (
                <div className="admin-table-report">
                    <div>All Events By Event Type</div>
                    <table className="admin-table">
                        <thead>
                        <tr>
                            {headerGroups.map(header => (
                                <th>{header}</th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {dataForAllEventsReport.map((event, i) => (
                            <tr key={`event.location-${i}`}>
                                <td>{event.location}</td>
                                <td>{event.totalVolunteers}</td>
                                <td>{event.totalVolunteerHours}</td>
                                <td>{event.totalVolunteerAvgHours}</td>
                            </tr>
                        ))}

                        <tr key={`all-events-total`}>
                            <td>Total</td>
                            {totalForAllEvents.map(total => (
                                <td>{total}</td>
                            ))}
                        </tr>
                        </tbody>
                    </table>

                    <div>HackNight Events Only</div>
                    <table className="admin-table">
                        <thead>
                        <tr>
                            {headerGroups.map(header => (
                                <th>{header}</th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {dataForHackNightReport.map((event, i) => (
                            <tr key={`event.location-${i}`}>
                                <td>{event.location}</td>
                                <td>{event.totalVolunteers}</td>
                                <td>{event.totalVolunteerHours}</td>
                                <td>{event.totalVolunteerAvgHours}</td>
                            </tr>
                        ))}
                        <tr key={`hack-night-total`}>
                            <td>Total</td>
                            {totalForHackNight.map(total => (
                                <td>{total}</td>
                            ))}
                        </tr>
                        </tbody>
                    </table>
                </div>
            ) : <Loading /> }
        </div>
    );
}

export default LocationTableReport;
