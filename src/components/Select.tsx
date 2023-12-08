import React, { useState, useRef, useEffect, useCallback } from "react";
import "../App.css";

// Define the shape of a user object
type UserType = {
  id: number;
  label: string;
  emoji?: string;
  selected: boolean;
};

// Define the properties expected by the Select component
type UsersProps = {
  users: UserType[];
  placeholder?: string;
  name: string;
  maxSelection?: number;
  allowAdd?: boolean;
};

// Select component definition
const Select: React.FC<UsersProps> = ({
  users,
  placeholder,
  name,
  maxSelection,
  allowAdd,
}: UsersProps) => {
  // State variables
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [addedUsers, setAddedUsers] = useState(users);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click on a user item
  const handleClick = useCallback(
    (id: number, checked: boolean) => {
      // Check if the maximum selection limit is reached
      if (maxSelection !== undefined) {
        const selectedCount = addedUsers.filter((user) => user.selected).length;
        if (selectedCount >= maxSelection && checked) {
          return;
        }
      }

      // Update the selected status of the user
      const updatedUsers = addedUsers.map((user) =>
        user.id === id ? { ...user, selected: checked } : user
      );
      setAddedUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    },
    [addedUsers, maxSelection]
  );

  // Handle key events in the input field
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        const value = event.currentTarget.value.trim();
        const found = addedUsers.find(
          (user) => user.label.toLowerCase() === value.toLowerCase()
        );

        // Check if the maximum selection limit is reached
        if (maxSelection !== undefined) {
          const selectedCount = filteredUsers.filter(
            (user) => user.selected
          ).length;
          if (selectedCount >= maxSelection) {
            return;
          }
        }

        // Add a new user if the entered value is valid
        if (value !== "" && !found && allowAdd) {
          const nextUsers = [
            { id: addedUsers.length, label: value, selected: true },
            ...addedUsers,
          ];
          setFilteredUsers(nextUsers);
          setAddedUsers(nextUsers);
          event.currentTarget.value = "";
        }
      } else if (event.key === "Escape") {
        // Close the dropdown on Escape key
        setOpen(false);
      } else {
        // Filter users based on the entered text
        const value = event.currentTarget.value.toLowerCase();
        const filtered =
          value !== ""
            ? addedUsers.filter((user) =>
                user.label.toLowerCase().includes(value)
              )
            : addedUsers;
        setFilteredUsers(filtered);
      }
    },
    [addedUsers, maxSelection]
  );

  // Handle opening the dropdown
  const handleOpen = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setOpen(true);
  }, []);

  // Handle clicks outside the dropdown to close it
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  // Attach event listeners for handling clicks outside the dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  // Generate a unique key for each user checkbox
  const generateKey = (id: number) => `checkbx-${id}`;

  // Render the Select component
  return (
    <div className="multi-select" onClick={handleOpen} ref={inputRef}>
      <div className="main-style">
        {/* Render selected users */}
        <ul className="selectedOpts">
          {addedUsers.map(
            (user) =>
              user.selected && (
                <li key={user.id}>
                  {user.label}
                  <input
                    type="checkbox"
                    checked={user.selected}
                    onChange={(e) => handleClick(user.id, e.target.checked)}
                    className="checkb"
                    id={`checkbb-${user.id}`}
                    value={user.id}
                    name={`${name}[]`}
                  />
                  <label
                    htmlFor={`checkbb-${user.id}`}
                    className="checkb-label"
                  ></label>
                </li>
              )
          )}
        </ul>
        {/* Render input field */}
        <input
          type="text"
          onKeyUp={handleKeyDown}
          className="main-input"
          placeholder={placeholder}
          ref={inputRef}
        />
        {/* Render dropdown arrow */}
        <label className={`selectarrow ${open ? "close" : ""}`}></label>
      </div>
      {/* Render the dropdown list */}
      {open && (
        <div className="list-main">
          <div className="list-wrap">
            {filteredUsers.length ? (
              // Render filtered users
              filteredUsers.map((user) => (
                <div key={user.id} className="listOpt">
                  <label htmlFor={generateKey(user.id)}>
                    {user.label}
                    {user.emoji}
                    <input
                      type="checkbox"
                      value={user.id}
                      id={generateKey(user.id)}
                      checked={user.selected}
                      onChange={(e) => handleClick(user.id, e.target.checked)}
                    />
                  </label>
                </div>
              ))
            ) : allowAdd ? (
              // Render message for adding a new value
              <p>Press Enter to add the value into the list</p>
            ) : (
              // Render message for no results found
              <p>No Result Found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
