import Select from "./components/Select";

const users = [
  { id: 0, label: "Software Engineer", emoji: "\u{1F984}", selected: false },
  { id: 1, label: "Construction", emoji: "\u{1F680}", selected: false },
  { id: 2, label: "Science", emoji: "\u{1F393}", selected: false },
  { id: 3, label: "Accountant", selected: false },
  { id: 4, label: "Finance", selected: false },
  { id: 5, label: "Marketing", emoji: "\u{1F44F}", selected: false },
  { id: 6, label: "Statistician", selected: false },
  { id: 7, label: "Sales", emoji: "\u{1F389}", selected: false },
];

function App() {
  return (
    <div className="main-container">
      <div className="wrapper">
        <div className="make-it-center">
          <Select
            users={users} // Array of user objects to display in the dropdown
            placeholder="Select your industry" // Placeholder text for the input. Remove this if no placeholder is needed.
            name="multiselect" // Name attribute for the selected values to be captured when submitting the form.
            maxSelection={6} // Maximum number of items that can be selected. Remove this for unlimited selections.
            allowAdd={true} // Flag to allow adding new values. If set to false, users can only search values from the list.
          />
        </div>
      </div>
    </div>
  );
}

export default App;
