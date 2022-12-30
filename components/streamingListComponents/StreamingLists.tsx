import {useState} from "react";

import {Alert, Collapse, ListGroup, ListGroupItem, Spinner,} from "react-bootstrap";
import StreamingListItem from "./SreamingListItem";
import StreamingTitle from "./StreamingListTitle";

type props = {
    title: string;
    data: Array<Object>;
    isLoading: boolean;
    error: boolean;
    receiving: boolean;
};

const StreamingList = ({title, data, isLoading, error, receiving}: props) => {
    // function convertUTCDateToLocalDate(date: Date) {
    //     return new Date(
    //         date.getTime() - date.getTimezoneOffset() * 60 * 1000
    //     );
    // }
    function convertUTCDateToLocalDate(date: Date) {
        // console.log('//////////////////////////////////////////////////////////////////////////////')
        // console.log('date', date)
        // console.log('date.getTime()', date.getTime())
        // console.log('date.getTimezoneOffset()', date.getTimezoneOffset())
        // console.log('date.getTimezoneOffset() * 60 * 1000', date.getTimezoneOffset() * 60 * 1000)
        // console.log('date.getTime() - date.getTimezoneOffset() * 60 * 1000', date.getTime() - date.getTimezoneOffset() * 60 * 1000)
        // console.log('new Date', new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000))
        // console.log('//////////////////////////////////////////////////////////////////////////////')
        return new Date(
            date.getTime() - date.getTimezoneOffset() * 60 * 1000
        );
    }


    // console.log('дата сейчаc', new Date())

    const [openList, setOpenList] = useState(true);

    return (
        <div className="streaming_list_wrap">
            <div className="">
                <div
                    onClick={() => setOpenList(!openList)}
                    aria-controls={`${title}`}
                    aria-expanded={openList}
                    className="drop-down-collapse-button"
                >
                    <h2 className="streaming_list_title">
                        {title}
                        {openList ? (
                            <i className="fas fa-arrow-circle-down mx-2"/>
                        ) : (
                            <i className="fas fa-arrow-circle-up mx-2"/>
                        )}
                    </h2>
                </div>
            </div>
            <Collapse in={openList}>
                <div id={`${title}`}>
                    {isLoading ? (
                        <div className="text-center my-4">
                            <Spinner
                                animation="border"
                                style={{width: "125px", height: "125px", color: "white"}}
                                className="m-auto mt-4"
                            />
                        </div>
                    ) : error ? (
                        <Alert variant="danger">Error fetching from database</Alert>
                    ) : data.length === 0 ? (
                        <span className="text-white">no data to dispaly</span>
                    ) : (
                        <ListGroup>
                            <StreamingTitle receiving={receiving}/>

                            {data.map((item: any) => {
                                return (
                                    <ListGroupItem
                                        key={item.id}
                                        className="p-0 listgroup-stream"
                                    >
                                        <StreamingListItem
                                            amount={item.amount}
                                            address={
                                                receiving ? item.address_from : item.address_to
                                            }
                                            // start={convertUTCDateToLocalDate(new Date(item.start_date))}
                                            start={ process.env.NODE_ENV !=="production"
                                                ? convertUTCDateToLocalDate(new Date(item.start_date))
                                                : new Date(item.start_date)}
                                            end={ process.env.NODE_ENV !=="production"
                                                ? convertUTCDateToLocalDate(new Date(item.end_date))
                                                : new Date(item.end_date)}
                                            // end={convertUTCDateToLocalDate(new Date(item.end_date))}
                                            receiving={receiving}
                                            withdrawn={item.withdrawn * 100}
                                            id={item.id}
                                            isCanceled={item.is_canceled}
                                            cancelDate={convertUTCDateToLocalDate(
                                                new Date(item.cancel_date)
                                            )}
                                            isMax={item.max_withdrawn_reached}
                                            currency={item.currency}
                                            newWithdrawn={item.newWithdrawn}
                                            newCancel={item.new_cancel}
                                            newStream={item.newStream}
                                            senderCancel={item.sender_cancel}
                                            receiverCancel={item.receiver_cancel}
                                            blockDate={convertUTCDateToLocalDate(
                                                new Date(item.block_date)
                                            )}
                                            nickname={item.nickname}
                                        />
                                    </ListGroupItem>
                                );
                            })}
                        </ListGroup>
                    )}
                </div>
            </Collapse>
        </div>
    );
};

export default StreamingList;
