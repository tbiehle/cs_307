import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form"

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    let id;
    const updated = characters.filter((character, i) => {
      if (i === index) {
        id = character.id;
      }
      return i !== index;
    });
    setCharacters(updated);

    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });

    return promise;
  }

  function clearTable() {
    const cleared = [];
    setCharacters(cleared);
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) { return res.json() }
        else { throw new Error("Failed to create user") }
      }).then((newUser) => {
        setCharacters([...characters, newUser]);
      }) 
      .catch((error) => console.log(error));
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });

    return promise
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json()) // res is the response from fetchUsers
      .then((json) => setCharacters(json["users_list"])) // json is the response from res.json()
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container">
      <Table 
        characterData={characters}
        removeCharacter={removeOneCharacter}  
        clearTable={clearTable}
      />
      <Form handleSubmit={updateList}/>
    </div>
  );
}

export default MyApp;