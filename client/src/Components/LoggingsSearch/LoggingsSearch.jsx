import React, { useState, useEffect } from "react";
import axios from "axios";
import Cards from "../Cards/Cards";
import { Link } from "react-router-dom";
import { Form, Input, FormGroup, Label, Button, Card, CardBody } from "reactstrap";
import { Divider } from "@chakra-ui/react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./LoggingsSearch.css";

const LoggingsSearch = () => {
  const [loggings, setLoggings] = useState([]);

  // const [filterName, setFilterName] = useState(" ");
  const [filterLocation, setFilterLocation] = useState(" ");

  const [searchResults, setSearchResults] = useState([])

  const role = localStorage.getItem("role"); 

  const [errorM, setErrorM] = useState(null);



  const getLoggings = async () => {
    try {
      const response = await axios.get("http://localhost:3500/api/loggings");
      console.log(response.data.alojamientos);
      setLoggings(response.data.alojamientos);
    } catch (error) {
      setErrorM(error.response.data.message);
    }
  };

  useEffect(() => {
    getLoggings();
  }, []);

  const handleClick = () => {
    const filteredPlaces = loggings.filter(logging => {
      // logging.location.toLowerCase().includes(filterLocation.toLowerCase()) || 
      // logging.name.toLowerCase().includes(filterName.toLowerCase())
      if(
        logging.location.toLowerCase().includes(filterLocation.toLowerCase()) 
        // || logging.name.toLowerCase().includes(filterName.toLowerCase())
      ) 
      {
       return true  
      }  
  });
   setSearchResults(filteredPlaces)
    console.log(filteredPlaces) 
  }
  
  return (
    <div>
      {role == 0 ? (
        <div>
          <h1>¿A dónde vamos?</h1>
          <Form>
            {/* <FormGroup floating>
              <Input
                className="input"
                id="name"
                name="name"
                value={filterName}
                placeholder="Name"
                type="text"
                onChange={(e) => setFilterName(e.target.value)}
              />
              <Label for="exampleName" className="label">
                Buscar alojamiento
              </Label>
            </FormGroup> */}
            {/* <FormGroup floating>
              <Input
                className="input"
                id="name"
                name="name"
                placeholder="Name"
                type="date"
                onChange={(e) => setFilterDayIn(e.target.value)}
              />
              <Label for="exampleName" className="label">
                Llegada
              </Label>
            </FormGroup> */}
            <FormGroup floating>
              <Input
                className="input"
                id="name"
                name="name"
                value={filterLocation}
                placeholder="Name"
                type="text"
                onChange={(e) => setFilterLocation(e.target.value)}
              />
              <Label for="exampleName" className="label">
                Lugar
              </Label>
            </FormGroup>
            <FormGroup inline>
              <Input type="checkbox" />
              <Label check className="title2">
                Viajo por trabajo
              </Label>
            </FormGroup>
          </Form>
            {/* <Link to={"/loggings"}> */}
              <Button className="button1" onClick={handleClick}>Buscar &gt;</Button>
            {/* </Link> */}
            <Link to={"/"}>
              <Button className="button2">&lt; Cancelar</Button>
            </Link>
          <div>
          {searchResults.map((alojamiento) => {
            return (
              <Card
                className="my-2"
                color="dark"
                inverse
                style={{
                  width: "380px",
                  height: "125px",
                }}
              >
                <CardBody>
                  <Link
                    key={alojamiento._id}
                    to={`/loggings_search/${alojamiento._id}`}
                  >
                    <div>
                      <h3>{alojamiento.location}</h3>
                      <h4>{alojamiento.name}</h4>
                      <Divider orientation="horizontal" />
                    </div>
                  </Link>
                </CardBody>
              </Card>
            );
          })}
          </div>
          <Divider orientation = "horizontal" />
          <Cards />
        </div>
      ) : (
        <div>
          <h1>¿A dónde vamos?</h1>
          <Form>
            {/* <FormGroup floating>
              <Input
                className="input"
                id="name"
                name="name"
                placeholder="Name"
                type="text"
                onChange={(e) => setFilterName(e.target.value)}
              />
              <Label for="exampleName" className="label">
                ¿A dónde viaja?
              </Label>
            </FormGroup> */}
            <FormGroup floating>
              <Input
                className="input"
                id="name"
                name="name"
                placeholder="Name"
                type="text"
                onChange={(e) => setFilterLocation(e.target.value)}
              />
              <Label for="exampleName" className="label">
                Lugar
              </Label>
            </FormGroup>
            <FormGroup inline>
              <Input type="checkbox" />
              <Label check className="title2">
                Viajo por trabajo
              </Label>
            </FormGroup>
            {/* <FormGroup floating>
              <Input
                className="input"
                id="name"
                name="name"
                placeholder="Name"
                type="date"
                onChange={(e) => setFilter(e.target.value)}
              />
              <Label for="exampleName" className="label">
                Salida
              </Label>
            </FormGroup> */}
            {/* <Link to={"/loggings"}> */}
              <Button className="button1" onClick={handleClick}>Buscar &gt;</Button>
            {/* </Link> */}
            <Link to={"/"}>
              <Button className="button2">&lt; Cancelar</Button>
            </Link>
          </Form>
          <div>
          {searchResults.map((alojamiento) => {
            return (
              <Card
                className="my-2"
                color="dark"
                inverse
                style={{
                  width: "380px",
                  height: "125px",
                }}
              >
                <CardBody>
                  <Link
                    key={alojamiento._id}
                    to={`/loggings_search/${alojamiento._id}`}
                  >
                    <div>
                      <h3>{alojamiento.location}</h3>
                      <h4>{alojamiento.name}</h4>
                      <Divider orientation="horizontal" />
                    </div>
                  </Link>
                </CardBody>
              </Card>
            );
          })}
          </div>
          <Divider orientation="horizontal" />
          <Cards />
        </div>
      )}
    </div>
  );
};

export default LoggingsSearch;
