import React from 'react';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import FeederLight from "../images/feeder_white.png";
import Badge from "react-bootstrap/Badge";
import {feederDeviceShape, feederTelemetryShape} from "../shapes/feeder";
import {formatUnixTimestamp, isStale} from "../util";
import Icon from '@mdi/react'
import {
    mdiBatteryCharging,
    mdiWifiStrength3,
    mdiLaserPointer
} from '@mdi/js';


export const FeederCardComponent = function (props) {
    // Get device name or generate generic name based on Device HID
    const feederName = props.feeder.name ? props.feeder.name : `New Feeder (${props.feeder.hid.substring(0, 6)})`
    // Check last seen date or show registration date.
    const lastPing = props.feeder.lastPingedAt ? props.feeder.lastPingedAt : props.feeder.discoveredAt
    const lastPingDate = formatUnixTimestamp(lastPing)
    const stale = isStale(lastPing)

    let telemetry = {
        rssi: "Unknown",
        charging: "Unknown",
        ir: "Unknown"
    }
    if (props.telemetry) {
        telemetry = {
            rssi: props.telemetry.rssi,
            charging: props.telemetry.charging ? "Charging" : "Charged",
            ir: props.telemetry.ir ? "Unobstructed" : "Obstructed"
        }
    }

    // This is to cover the case where we need to disable the buttons and telemetry
    // for devices that have registered themselves but not yet connected to MQTT
    const enabled = !stale && props.feeder.lastPingedAt !== 0 && props.feeder.lastPingedAt !== null

    return (
        <Card style={{marginBottom: 20}}>
            <Card.Body>
                <Container>
                    <Row>
                        <Col md={12} lg={2}>
                            <img
                                src={FeederLight}
                                alt={"feeder"}
                                style={{maxHeight: 300, maxWidth: "100%", margin: "auto", display: "block"}}
                            />
                        </Col>
                        <Col md={12} lg={10}>

                            <Row style={{marginTop: 25}}>
                                <Col sm={12} md={6}>
                                    <div>
                                        <Card.Title>{feederName} {
                                            stale ?
                                                <Badge variant="warning">Disconnected</Badge> :
                                                <Badge variant="success">Connected</Badge>
                                        }</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">Last
                                            Seen: {lastPingDate}</Card.Subtitle>
                                    </div>
                                    {enabled ?
                                        <Card.Text>
                                            <ul>
                                                <li><Icon path={mdiWifiStrength3} size={.75}/> WiFi Signal
                                                    Strength: {telemetry.rssi}
                                                </li>
                                                <li><Icon path={mdiBatteryCharging}
                                                          size={.75}/> Battery: {telemetry.charging}</li>
                                                <li><Icon path={mdiLaserPointer} size={.75}/> IR Beam: {telemetry.ir}
                                                </li>
                                            </ul>
                                        </Card.Text> :
                                        <div>
                                            <p>
                                                This feeder has either not reported data recently or was just
                                                discovered.
                                            </p>
                                            <p>
                                                Once it has started communicating with the message broker,
                                                it will be available in the UI.
                                            </p>
                                        </div>
                                    }
                                </Col>
                                <Col sm={12} md={6}>
                                    <Button style={{width: "100%"}} className={"my-1"} variant="secondary"
                                            disabled={!enabled} onClick={props.showSnackModal}>
                                        Snack Time!
                                    </Button>
                                    <Button style={{width: "100%"}} className={"my-1"} disabled={!enabled}
                                            variant="info">Scheduling
                                    </Button>
                                    <Button style={{width: "100%"}} className={"my-1"} variant="warning"
                                            disabled={!enabled} onClick={props.showEditModal}>
                                        Edit Feeder
                                    </Button>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    )
}

FeederCardComponent.propTypes = {
    feeder: feederDeviceShape,
    telemetry: feederTelemetryShape
}