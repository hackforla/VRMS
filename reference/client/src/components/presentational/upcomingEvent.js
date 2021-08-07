import React from "react";
import { ReactComponent as ClockIcon } from "../../svg/Icon_Clock.svg";
import { ReactComponent as LocationIcon } from "../../svg/Icon_Location.svg";
import { Link } from "react-router-dom";

import moment from "moment";

const upcomingEvent = (props) => {
    return props.nextEvent[0] ? (
        <div className="warning-event">
            <div className="warning-event-headers">
                <p className="event-name">{props.nextEvent[0].name}</p>
                <div className="event-info-wrapper">
                    <ClockIcon />
                    <p className="event-info">
                        {moment(props.nextEvent[0].date).format(
                            "ddd, MMM D @ h:mm a"
                        )}
                    </p>
                </div>
                {props.nextEvent[0].location.city !== "" ? (
                    <div className="event-info-wrapper">
                        <LocationIcon />
                        <p className="event-info">
                            {props.nextEvent[0].location.city},{" "}
                            {props.nextEvent[0].location.state}
                        </p>
                    </div>
                ) : null}
            </div>
            <div className="warning-event-toggle">
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
            </div>
        </div>
    ) : (
        <div>No events coming up!</div>
    );
};
export default upcomingEvent;
