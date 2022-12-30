import Header from "../components/Header";
import {Container} from "react-bootstrap";

const Page404 = () => {
    return (
        <>
            <Header/>
            <Container className="max-container px-2 mb-lg-2">

                <div className="text-center my-4 py-4 page-404">
                    <i className="fas fa-times-circle d-block text-danger my-4"/>
                    <span className="my-4 text-white">404 page not found</span>
                </div>
            </Container>
        </>
    )
};

export default Page404;
