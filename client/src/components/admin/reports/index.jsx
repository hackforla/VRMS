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

    const styles = {
        adminTableReport: {
            margin: '10px 0',
            fontSize: '15px',
            textAlign: 'center',
        },
        statsSection: {
            marginTop: '10px',
            textAlign: 'right'
        },
        tableHeader: {
            fontSize: '15px',
            fontWeight: 'bold',
            backgroundColor: '#3d5a6c47',
            margin: '20px 0 5px',
            padding: '5px',
            borderRadius: '7px 7px 0 0',
            textAlign: 'center'
        },
        adminTable: {
            width: '100%',
            marginTop: '10px',
            borderCollapse: 'collapse',
            border: 'none',
        },
        tableCell: {
            textAlign: 'center',
            height: '30px',
            border: 'none',
        },
        lastRowCell: {
            color: '#3D5A6C',
            fontWeight: 'bold',
            borderTop: '1px solid lightgray',
            borderBottom: 'none',     
            textAlign: 'center',
            height: '30px',
            
        },
        firstRowCell: {
            color: '#3D5A6C',
            fontWeight: 'bold',
            borderBottom: 'none',
            textAlign: 'center',
            height: '30px',
            
        },
        filterButton: {
            color: '#3D5A6C',
            border: '1px solid lightgray',
            borderRadius: '20px',
            lineHeight: '1',
            padding: '10px 20px',
            margin: '0 auto',
            transition: '.3s ease',
            maxWidth: '120px',
            minWidth: '120px',
            height: 'auto',
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '15px',
        },
        calcButton: {
            maxWidth: '150px',
            minWidth: '150px',
        },
        chartImage: {
            maxWidth: '90px',
        },
        timeDescription: {
            fontSize: '13px',
            textAlign: 'right',
            marginTop: '10px',
        },
        boldText: {
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#3D5A6C',
        },
        
    };

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
                <Box style={styles.adminTableReport}>
                    {isFilterButton && (
                        <Button style={styles.filterButton} onClick={() => handleSetFilterBtn()}>
                            Set Filter
                        </Button>
                    )}

                    {isDatepicker &&
                        <Box>
                            <Box>
                                <Typography>Start</Typography>
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

                            <Box>
                                <Typography>End</Typography>
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

                            <Button variant="outlined" style = {styles.filterButton} onClick={(event) => handleCalculateStatsBtn(event)}>
                                Calculate Stats
                            </Button>
                        </Box>
                    }

                    <Box style={styles.statsSection}>
                        <Typography variant="body1">
                            Stats calculated by: {!isFiltered ? 'all time' : `${startTextDate} - ${endTextDate}`}
                        </Typography>

                        <Box>
                            <Typography variant="h6" style={styles.tableHeader}>All Events By Event Type</Typography>
                        </Box>
                        {isStatsByLocation ? (
                            <Table style={styles.adminTable}>
                                <TableHead>
                                    <TableRow>
                                        {headerGroups.map((header) => (
                                            <TableCell key={header}style={styles.firstRowCell}>{header}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataForAllEventsReport.map((event) => (
                                        <TableRow key={`events-${event.location}`}>
                                            <TableCell style={styles.tableCell}>{event.location}</TableCell>
                                            <TableCell style={styles.tableCell}>{event.totalVolunteers}</TableCell>
                                            <TableCell style={styles.tableCell}>{event.totalVolunteerHours}</TableCell>
                                            <TableCell style={styles.tableCell}>{event.totalVolunteerAvgHours}</TableCell>
                                        </TableRow>
                                    ))}
                                    {totalForAllEvents && (
                                        <TableRow>
                                            <TableCell style={styles.lastRowCell}>Total</TableCell>
                                            {totalForAllEvents.map((total, i) => (
                                                <TableCell key={`${headerGroups[i]}-events-total`}style={styles.lastRowCell}>{total}</TableCell>
                                            ))}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography>No data for calculation stats</Typography>
                        )}
              
                        <Box>
                            <Typography variant="h6" style={styles.tableHeader}>HackNight Only</Typography>
                        </Box>
                            {isStatsByHackNight ? (
                                <Table style={styles.adminTable}>
                                    <TableHead>
                                        <TableRow>
                                            {headerGroups.map((header) => (
                                                <TableCell key={header} style={styles.firstRowCell}>{header}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataForHackNightReport.map((event) => (
                                            <TableRow key={`hack-night-${event.location}`}>
                                                <TableCell style={styles.tableCell}>{event.location}</TableCell>
                                                <TableCell style={styles.tableCell}>{event.totalVolunteers}</TableCell>
                                                <TableCell style={styles.tableCell}>{event.totalVolunteerHours}</TableCell>
                                                <TableCell style={styles.tableCell}>{event.totalVolunteerAvgHours}</TableCell>
                                            </TableRow>
                                        ))}
                                        {totalForHackNight && (
                                            <TableRow>
                                                <TableCell style={styles.lastRowCell}>Total</TableCell>
                                                {totalForHackNight.map((total, i) => (
                                                    <TableCell key={`${headerGroups[i]}-hack-total`} style={styles.lastRowCell}>{total}</TableCell>
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
        