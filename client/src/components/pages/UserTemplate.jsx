import React from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";

function UserTemplate({ name, email, image, phone }) {
  return (
    <Card style={{ width: "18rem" }} className="user-card">&nbsp;
      <div className="profile-picture-container bg-custom6">
        <Card.Img variant="top" src={image} className="profile-picture" />
      </div>&nbsp;
      <Card.Body className="">
        <Card.Title>{name}</Card.Title>
        <ListGroup className="list-group-flush bg-custom6">
          <ListGroupItem>
            <b>Phone:</b> {phone}
          </ListGroupItem>
          <ListGroupItem>
            <b>Email:</b> {email}
          </ListGroupItem>
        </ListGroup>
      </Card.Body>&nbsp;
    </Card>
  );
}

export default UserTemplate;
