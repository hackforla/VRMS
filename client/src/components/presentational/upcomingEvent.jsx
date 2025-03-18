import React from "react";
import { ReactComponent as ClockIcon } from "../../svg/Icon_Clock.svg";
import { ReactComponent as LocationIcon } from "../../svg/Icon_Location.svg";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import moment from "moment";

const upcomingEvent = (props) => {
    return props.nextEvent[0] ? (
        <Box className="warning-event">
            <Box className="warning-event-headers">
                <Typography className="event-name">{props.nextEvent[0].name}</Typography>
                <Box className="event-info-wrapper">
                    <ClockIcon />
                    <Typography className="event-info" sx={{ margin: '0px 0px 0px 12px' }}>
                        {moment(props.nextEvent[0].date).format(
                            "ddd, MMM D @ h:mm a"
                        )}
                    </Typography>
                </Box>
                {props.nextEvent[0].location.city !== "" &&
                    <Box className="event-info-wrapper">
                        <LocationIcon />
                        <Typography className="event-info" sx={{ margin: '0px 0px 0px 12px' }}>
                            {props.nextEvent[0].location.city},{" "}
                            {props.nextEvent[0].location.state}
                        </Typography>
                    </Box>
                }
            </Box>
            <Box className="warning-event-toggle">
                {props.nextEvent[0] && props.isCheckInReady === false ? (
                    <Link
                        to={`/events/${props.nextEvent[0]._id}`}
                        className="checkin-toggle fill-green"
                        onClick={(e) =>
                            props.setCheckInReady(e, props.nextEvent[0]._id)
                        }
                    >
                        OPEN CHECK-IN
                    </Link>
                ) : (
                    <Link
                        to={`/events/${props.nextEvent[0]._id}`}
                        className="checkin-toggle fill-red"
                        onClick={(e) =>
                            props.setCheckInReady(e, props.nextEvent[0]._id)
                        }
                    >
                        CLOSE CHECK-IN
                    </Link>
                )}
            </Box>
        </Box>
    ) : (
        <Box>No events coming up!</Box>
    );
};
export default upcomingEvent;
