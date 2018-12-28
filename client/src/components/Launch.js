import React, { Component, Fragment } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Link } from "react-router-dom";
import classNames from "classnames";
import ReactGA from "react-ga";

const LAUNCH_QUERY = gql`
  query LaunchQuery($flight_number: Int!) {
    launch(flight_number: $flight_number) {
      flight_number
      mission_name
      launch_year
      launch_success
      launch_date_local
      rocket {
        rocket_id
        rocket_name
        rocket_type
      }
    }
  }
`;

class Launch extends Component {
  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
    console.log("ReactGA :", ReactGA);
  }

  render() {
    let { flight_number } = this.props.match.params;
    flight_number = parseInt(flight_number);
    return (
      <Fragment>
        <Query query={LAUNCH_QUERY} variables={{ flight_number }}>
          {({ loading, error, data }) => {
            if (loading) return <h4>LOADING...</h4>;
            if (error) console.log(error);

            const {
              mission_name,
              flight_number,
              launch_year,
              launch_success,
              rocket: { rocket_id, rocket_name, rocket_type }
            } = data.launch;
            return (
              <div>
                <h1 className="display-4 my-3" style={{ textAlign: "center" }}>
                  Mission:
                  <span
                    className={classNames({
                      "text-success": launch_success,
                      "text-danger": !launch_success
                    })}
                  >
                    {mission_name}
                  </span>
                </h1>
                <h4 className="mb-3">Launch Details</h4>
                <ul className="list-group">
                  <li className="list-group-item">
                    Flight Number: {flight_number}
                  </li>
                  <li className="list-group-item">
                    Launch Year: {launch_year}
                  </li>
                  <li className="list-group-item">
                    Launch Success:{" "}
                    <span
                      className={classNames({
                        "text-success": launch_success,
                        "text-danger": !launch_success
                      })}
                    >
                      {launch_success ? "Yes" : "No"}
                    </span>
                  </li>
                </ul>

                <h4 className="mb-3" style={{ marginTop: 30 }}>
                  Rocket Details
                </h4>
                <ul className="list-group">
                  <li className="list-group-item">Rocket ID: {rocket_id}</li>
                  <li className="list-group-item">
                    Rocket Name: {rocket_name}
                  </li>
                  <li className="list-group-item">
                    Rocket Type: {rocket_type}
                  </li>
                </ul>
                <hr />
                <Link
                  to="/"
                  className="btn btn-secondary"
                  style={{ float: "right" }}
                >
                  Back
                </Link>
              </div>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default Launch;
