import React from "react";
import Title from "./components/Title";
import Button from "./components/Button";
import MyEditor from "./components/Editor";

const App: React.FC = () => {
  const handleSave = () => {
    // Logic to save content is handled within Editor.tsx using localStorage
  };

  return (
    <div>
      <div className="header container">
        <Title />
        <Button onSave={handleSave} />
      </div>
      <MyEditor />
    </div>
  );
};

export default App;
