import React, {useState} from 'react';
import Loading from '../donutChartLoading';
import DatePicker from 'react-datepicker';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
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
            // eslint-disable-next-line no-unused-vars
            for (const [_, value] of Object.entries(data[i])) {
                const res = total + value;
                total = Math.round(100 * res) / 100;
            }
            if (types === eventTypes) {
                totalForAllEvents.push(total);
            }

            if (types === hackNightTypes) {
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

    function sortEventsByDate(processedEvents) {
        //The array is sorted from earliest to oldest events (Jan 2020)
        sortedEventsByDate = processedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    function handleCalculateStatsBtn() {
        isLoading = true;
        showDatepicker(!isDatepicker);
        showFilterButton(!isFilterButton);
        setFilterState(true);
        extractEventsByCustomTimePeriod();
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
        <Box className="table-report-wrap">
            {!isLoading ? (
                <Box className="admin-table-report">
                    {isFilterButton && (
                        <Button className="filter-button" onClick={() => handleSetFilterBtn()}>
                            Set Filter
                        </Button>
                    )}

                    {isDatepicker &&
                        <Box className="datepicker-section">
                            <Box className="datepicker-wrap">
                                <Typography className="datepicker-name">Start</Typography>
                                <DatePicker
                                    placeholderText='Start date range'
                                    selected={startDate}
                                    onChange={date => handleChangeStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    maxDate={endDate}
                                />
                            </Box>

                            <Box className="datepicker-wrap">
                                <Typography className="datepicker-name">End</Typography>
                                <DatePicker
                                    placeholderText='End data range'
                                    selected={endDate}
                                    onChange={date => handleChangeEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    maxDate={new Date()}
                                />
                            </Box>

                            <Button variant="outlined" onClick={(event) => handleCalculateStatsBtn(event)}>
                                Calculate Stats
                            </Button>
                        </Box>
                    }

                    <Box className="stats-section">
                        <Typography variant="body1">
                            Stats calculated by: {!isFiltered ? 'all time' : `${startTextDate} - ${endTextDate}`}
                        </Typography>

                        <Box className="all-events-section">
                            <Typography variant="h6" className="bold-text">All Events By Event Type</Typography>
                        </Box>
                        {isStatsByLocation ? (
                            <Table className="admin-table">
                                <TableHead>
                                    <TableRow>
                                        {headerGroups.map((header) => (
                                            <TableCell key={header}>{header}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataForAllEventsReport.map((event) => (
                                        <TableRow key={`events-${event.location}`}>
                                            <TableCell>{event.location}</TableCell>
                                            <TableCell>{event.totalVolunteers}</TableCell>
                                            <TableCell>{event.totalVolunteerHours}</TableCell>
                                            <TableCell>{event.totalVolunteerAvgHours}</TableCell>
                                        </TableRow>
                                    ))}
                                    {totalForAllEvents && (
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            {totalForAllEvents.map((total, i) => (
                                                <TableCell key={`${headerGroups[i]}-events-total`}>{total}</TableCell>
                                            ))}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography>No data for calculation stats</Typography>
                        )}
              
                        <Box className="hacknight-only-section">
                            <Typography variant="h6" className="bold-text">HackNight Only</Typography>
                        </Box>
                            {isStatsByHackNight ? (
                                <Table className="admin-table">
                                    <TableHead>
                                        <TableRow>
                                            {headerGroups.map((header) => (
                                                <TableCell key={header}>{header}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataForHackNightReport.map((event) => (
                                            <TableRow key={`hack-night-${event.location}`}>
                                                <TableCell>{event.location}</TableCell>
                                                <TableCell>{event.totalVolunteers}</TableCell>
                                                <TableCell>{event.totalVolunteerHours}</TableCell>
                                                <TableCell>{event.totalVolunteerAvgHours}</TableCell>
                                            </TableRow>
                                        ))}
                                        {totalForHackNight && (
                                            <TableRow>
                                                <TableCell>Total</TableCell>
                                                {totalForHackNight.map((total, i) => (
                                                    <TableCell key={`${headerGroups[i]}-hack-total`}>{total}</TableCell>
                                                ))}
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Typography>No data for calculation stats</Typography>
                            )}
                        </Box>
                    </Box>
            ) : (
                <Loading />
            )}
        </Box>
    );
};

export default LocationTableReport;
        