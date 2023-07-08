const styles = {
  color: "green",
  background: "lightgrey",
  fontSize: "20px",
  borderStyle: "solid",
  borderRadius: "5px",
  padding: "10px",
  marginBottom: "10px",
}

// if type equal error: color:red else color:green
export default function Notification({ message }) {
  if (message === null) {
    return null
  }

  return (
    <div style={message.toLowerCase().includes("error".toLowerCase()) ? { ...styles, color: "red" } : styles}>
      {message}
    </div>
  )
}