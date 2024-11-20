import React from 'react'

function AuthModel({ onClose, selectedOption, onSelectOption, children }) {
    return (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Select an Option</h2>
            <div style={styles.optionsContainer}>
              <label>
                <input
                  type="radio"
                  name="option"
                  onChange={() => onSelectOption("Option 1")}
                  checked={selectedOption === "Option 1"}
                />
                Option 1
              </label>
              <label>
                <input
                  type="radio"
                  name="option"
                  onChange={() => onSelectOption("Option 2")}
                  checked={selectedOption === "Option 2"}
                />
                Option 2
              </label>
              <label>
                <input
                  type="radio"
                  name="option"
                  onChange={() => onSelectOption("Option 3")}
                  checked={selectedOption === "Option 3"}
                />
                Option 3
              </label>
              <label>
                <input
                  type="radio"
                  name="option"
                  onChange={() => onSelectOption("Option 4")}
                  checked={selectedOption === "Option 4"}
                />
                Option 4
              </label>
            </div>
            <hr />
            <div style={styles.contentArea}>{children}</div>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      );
    };
    
    const styles = {
      modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1050,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      modalContent: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "5px",
        width: "800px",
        textAlign: "center",
      },
      optionsContainer: {
        display: "flex",
        // flexDirection: "column",
        alignItems: "flex-start",
        justifyContent:'center',
        gap: "10px",
      },
      contentArea: {
        marginTop: "20px",
        textAlign: "center",
      },
    };

export default AuthModel
